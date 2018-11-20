"use strict";

import * as env from "../server/environment";
import * as error from "../server/error";
import { IArticleAudit, ArticleAudit } from "./schema";
import { resolve } from "path";

const conf = env.getConfig(process.env);

interface ArticleRequest {
    articleId: string;
    from: Date;
    to: Date;
}

export function findArticleEntries(query: ArticleRequest): Promise<IArticleAudit[]> {
    return new Promise<IArticleAudit[]>((resolve, reject) => {
        ArticleAudit.find({
            articleId: query.articleId,
            date: { $gt: query.from, $lt: query.to}
        },
            function (err: any, articles: IArticleAudit[]) {
                if (err) return reject(err);
                resolve(articles);
            });
    });
}

export function findAllArticlesEntries(): Promise<IArticleAudit[]> {
    return new Promise<IArticleAudit[]>((resolve, reject) => {
        ArticleAudit.find({
        },
            function (err: any, articles: IArticleAudit[]) {
                if (err) return reject(err);
                resolve(articles);
            });
    });
}
