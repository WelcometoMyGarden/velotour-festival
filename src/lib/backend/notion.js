// Copy-paste from slowbyCloudFunctions
//
// Utilities for working with Notion objects

// See type here https://developers.notion.com/reference/property-object
export const NOTION_PROP_TYPE = {
    CHECKBOX: "checkbox",
    CREATED_BY: "created_by",
    CREATED_TIME: "created_time",
    DATE: "date",
    EMAIL: "email",
    FILES: "files",
    FORMULA: "formula",
    LAST_EDITED_BY: "last_edited_by",
    LAST_EDITED_TIME: "last_edited_time",
    MULTI_SELECT: "multi_select",
    NUMBER: "number",
    PEOPLE: "people",
    PHONE_NUMBER: "phone_number",
    RELATION: "relation",
    RICH_TEXT: "rich_text",
    ROLLUP: "rollup",
    SELECT: "select",
    STATUS: "status",
    TITLE: "title",
    URL: "url",
};

export const flattenNotionPropValue = (propDetails) => (flattenNotionPropsFunctions[propDetails.type])(propDetails)

const textContent = (prop) => prop && prop.text && typeof prop.text.content === "string" && prop.text.content
const titleContent = (prop) => prop && prop.title && prop.title.length > 0 && textContent(prop.title[0])

export const parseNotionDate = (obj) => {
    if (!obj) {
        return { start: null, end: null, time_zone: null }
    }
    const { start, end, time_zone } = obj
    return { start: start ? new Date(start) : null, end: end ? new Date(end) : null, time_zone }
}

const {
    CHECKBOX,
    CREATED_BY,
    CREATED_TIME,
    DATE,
    EMAIL,
    FILES,
    FORMULA,
    LAST_EDITED_BY,
    LAST_EDITED_TIME,
    MULTI_SELECT,
    NUMBER,
    PEOPLE,
    PHONE_NUMBER,
    RELATION,
    RICH_TEXT,
    ROLLUP,
    SELECT,
    STATUS,
    TITLE,
    URL,
} = NOTION_PROP_TYPE;



// To flatten Notion properties into a simple representation of their values
// e.g. {type: "checkbox", checkbox: true} => true
export const flattenNotionPropsFunctions = {
    [CHECKBOX]: ({ checkbox }) => checkbox,
    [RICH_TEXT]: ({ rich_text }) => {
        if (rich_text instanceof Array && rich_text.length > 0) {
            return rich_text[0].plain_text;
        }
        return null;
    },
    [EMAIL]: ({ email }) => email,
    // includes {"id", "name"}
    [SELECT]: ({ select }) => select?.name,
    // multi_select for now not used
    [NUMBER]: ({ number }) => number,
    [FORMULA]: ({ formula }) => {
        switch (formula.type) {
            case "string":
                return formula.string;
            case "number":
                return formula.number;
            case "boolean":
                return formula.boolean;
            case "date":
                return formula.date;
            default:
                console.warn(`Unsupported formula type: ${formula.type}`);
                return null;
        }
    },
    [LAST_EDITED_BY]: () => { },
    [LAST_EDITED_TIME]: () => { },
    [PHONE_NUMBER]: ({ phone_number }) => phone_number,
    [RELATION]: ({ relation }) => relation,
    [TITLE]: titleContent,
    [DATE]: ({ date }) => parseNotionDate(date),
    [URL]: ({ url }) => url,
    // unused props
    [MULTI_SELECT]: ({ multi_select }) => multi_select,
    [STATUS]: ({ status }) => status,
    [ROLLUP]: ({ rollup }) => rollup,
    [PEOPLE]: ({ people }) => people,
    [FILES]: ({ files }) => files,
    [CREATED_BY]: () => { },
    [CREATED_TIME]: () => { }
};

// The reverse of flattenNotionPropsFunctions
// Given a Notion property type, and and a flattened value,
// reconstruct the Notion property structure that can be added to a
// PATCH or POST request (page update)
export const flatValuetoNotionPropValueFunctions = {
    [CHECKBOX]: (checkbox) => ({ checkbox }),
    /**
     * Note: this only does not support annotations, links, and other features of rich text objects
     * https://developers.notion.com/reference/rich-text
     * https://developers.notion.com/reference/property-value-object#rich-text-property-values
     */
    [RICH_TEXT]: (content) => {
        return { rich_text: [{ type: "text", text: { content } }] };
    },
    [EMAIL]: (email) => ({ email }),
    // a `select` object has the form {id, name}
    [SELECT]: (select) => ({ select }),
    [NUMBER]: (number) => ({ number }),
    // We should probably never set a formula field!
    [FORMULA]: ({ value }) => {
        const wrapFormula = (formula) => ({ type: FORMULA, formula });
        switch (typeof value) {
            case "string":
                return wrapFormula({ type: "string", string: value });
            case "number":
                return wrapFormula({ type: "number", number: value });
            case "boolean":
                return wrapFormula({ type: "boolean", boolean: value });
            // assume something else is a date
            default:
                const tryDate = new Date(value);
                if (tryDate.toString() != "Invalid Date") {
                    return wrapFormula({ type: "date", date: value });
                }
                return null;
        }
    },
    [PHONE_NUMBER]: (phone_number) => ({ phone_number }),
    // NOTE: This might not be so usable
    [RELATION]: (relation) => ({ relation }),
    [TITLE]: (content) => ({
        // https://developers.notion.com/reference/property-value-object#title-property-values
        // doesn't seem to follow the docs...
        // id: 'title',
        // name: content,
        // title: flatValuetoNotionPropValueFunctions[RICH_TEXT](content)
        title: [
            {
                type: "text",
                text: {
                    content,
                },
            },
        ],
    }),
    // date objects are of the form {start (str), end (str), time_zone}
    [DATE]: (date) => ({ date }),
    [URL]: (url) => ({ url }),
    // unused props
    [MULTI_SELECT]: (multi_select) => ({ multi_select }),
    [STATUS]: (status) => ({ status }),
    [ROLLUP]: (rollup) => ({ rollup }),
    [PEOPLE]: (people) => ({ people }),
    [FILES]: (files) => ({ files }),
};
