import Pcfg = require("./pcfg");
import Rule = require("./rule");
import RuleTree = require("./rule_tree_node");
import RuleList = require("./rule_list");

const rules: Rule[] = RuleList;

const textList = [
    "隣の客はよく柿食う客だ",
    "すもももももももものうち",
    "もし高校野球の女子マネージャーがドラッカーのマネジメントを読んだら",
    "typescript、深淵かと思ったけど新しい言語環境になれるのはやっぱり時間かかるよね、と思い直した",
];
const verbose: boolean = true; // 詳細表示フラグ
for (const text of textList) {
    console.log("text=" + text);
    if (verbose) rules.forEach((v) => console.log(v.toString(), v.probability));
    Pcfg.parse(text, rules, verbose, (nodeTree, tokens, newRules) => {
        console.log("### result ###");
        if (!nodeTree) {
            console.log("Cannot parse");
        } else {
            const N = nodeTree.length;
            display(nodeTree, tokens, 0, N - 1, "S", verbose);
            if (verbose)
                newRules.forEach((v) =>
                    console.log(v.toString(), v.probability)
                );
        }
    });
}

function display(
    tree: RuleTree.Node[][],
    tokens: Array<any>,
    x: number,
    y: number,
    pos: string,
    verbose: boolean,
    depth = 0,
    leafCount = 0
) {
    const top = tree[x][y];
    if (top === undefined) return leafCount;
    let result = "";
    const rule: Rule = top.rules[pos].sort((a, b) =>
        a.probability < b.probability ? -1 : 1
    )[0];
    if (rule.result1 == "END") {
        if (verbose) {
            result = "--->" + tokens[leafCount].surface_form;
        } else {
            result = tokens[leafCount].surface_form;
        }
        leafCount++;
    } else {
        if (verbose) {
            result = "(" + rule.probability.toString() + ")";
        } else {
            result = "";
        }
    }

    if (verbose)
        console.log(new Array(depth * 4).join(" "), rule.source, result);
    if (result) console.log(new Array(depth * 4).join(" "), result);
    if (rule.result1 !== "END") {
        leafCount = display(
            tree,
            tokens,
            top.left[rule.toString()].x,
            top.left[rule.toString()].y,
            rule.result1,
            verbose,
            depth + 1,
            leafCount
        );
    }
    if (rule.result2 !== "END") {
        leafCount = display(
            tree,
            tokens,
            top.right[rule.toString()].x,
            top.right[rule.toString()].y,
            rule.result2,
            verbose,
            depth + 1,
            leafCount
        );
    }
    return leafCount;
}
