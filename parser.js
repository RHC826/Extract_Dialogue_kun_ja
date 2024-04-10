// @ts-check
"use strict";
/**
 * parser : 「」で囲まれた部分を抽出するパーサーを for ループで書いたもの
 *
 * @param {string} ctx
 */
const parse = (ctx) => {
    /*
     *  執筆中の文章が引数になることを想定して \n を 」 と近い扱いにする。
     * 『「おはようございま\n』
     * のような文章を拾い上げるためだ。
     *
     * 『「おはよう
     * ございます」』
     *
     * のような文章についてはまた今度考える。
     */
    /*
     * ```
     * string ::= "「" + [^「」]* + [」\n]
     * number ::= [0-9] | [0-9] + number
     * output ::= number +  "\n" + "「" + string + "」"
     * ```
     * /
    /** @type string[] */
    let strings = [];
    let flag = false;
    const balance = { left: 0, right: 0 };
    for (let cur of ctx) {
        if (cur === "「") {
            flag = true;
            balance.left += 1;
        }
        if (cur === "」" || cur === "\n") {
            if (cur === "」" && balance.left > balance.right) {
                balance.right += 1;
            } else {
                flag = false;
                strings.push(`${cur}\n---\n`);
            }
        }
        if (balance.left === balance.right && balance.right > 0) {
            flag = false;
            balance.left = 0;
            balance.right = 0;
            strings.push(`${cur}\n---\n`);
            continue;
        }
        if (balance.left !== balance.right) {
            strings.push(cur);
        }
    }
    const result = res(strings);
    /** @type  HTMLTextAreaElement | null*/
    const OutputForm = document.querySelector("textarea#output");

    if (OutputForm) {
        OutputForm.value = result;
    }
};
/**
 *
 * @param {string[]} strings
 * @returns {string}
 */
const res = (strings) => {
    const tmp = strings
        .join("")
        .split("\n---\n")
        .filter((cur) => cur.includes("「"))
        .map((body, index) => `${body}`);
    //.map((body, index) => `${index}${body}`)

    return JSON.stringify(tmp, null, 2);
};

document.querySelector("button#run_parser")?.addEventListener("click", () => {
    console.log("click!");
    /** @type HTMLTextAreaElement | null */
    const node = document.querySelector("textarea#input");
    if (!node) {
        return;
    }
    return parse(node.value);
});

document.querySelector("button#copy")?.addEventListener("click", () => {
    console.log("click!");

    /** @type HTMLTextAreaElement | null */
    const text = document.querySelector("textarea#output");

    if (text) {
        navigator.clipboard.writeText(text.value);
    }
});

/**
 * parser : 「」で囲まれた部分を抽出するパーサー をメソッドで書いたもの
 * number :== [0-9] | [0-9] + number
 * output :== number + "\n" + "「" + string + "」"
 * strint :== "「" + [^「」]* + "」"
 * @param {string} ctx
 */
const parse_method = (ctx) => {
    let strings = [];
    let flag = false;
    [...ctx].forEach((cur) => {
        if (cur === "「") {
            flag = true;
        }
        if (cur === "」" || cur === "\n") {
            strings.push(`${cur}\n---\n`);
        }
        if (flag) {
            strings.push(cur);
        }
    });
    const result = res(strings);
    /** @type HTMLTextAreaElement | null */
    const outputForm = document.querySelector("textarea#output");

    if (outputForm) {
        outputForm.value = result;
    }
};

/**
 * parser : 「」で囲まれた部分を抽出するパーサーを再帰で書いたもの
 *
 * number :== [0-9] | [0-9] + number
 *
 * output :== number + "\n" + "「" + string + "」"
 *
 * strint :== "「" + [^「」]* + "」"
 *
 * @param {string} ctx
 */
const parse_recursive = (ctx) => {
    let strings = [];

    const processString = (index, flag) => {
        if (index >= ctx.length) {
            return;
        }

        const cur = ctx[index];

        if (cur === "「") {
            flag = true;
        }
        // 」なしを想定。「が複数あるとうまくいかないだろう
        if (cur === "」" || cur === "\n") {
            flag = false;
            strings.push(`${cur}\n---\n`);
        }
        if (flag) {
            strings.push(cur);
        }

        processString(index + 1, flag);
    };

    processString(0, false);

    const result = res(strings);
    /** @type HTMLTextAreaElement | null */
    const outputForm = document.querySelector("textarea#output");

    if (outputForm) {
        outputForm.value = result;
    }
};
