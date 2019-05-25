import { Comment } from "./Comment";

export interface Store {
    id: number;
    href: string;
    uri: string;
    name: string;
    description: string;
    sector: string;
    added: number;
    digital_goods: string;
    img_position: string;
    facebook: string;
    twitter: string;
    reddit: string;
    rank: number;
}

export interface Store {
    trending: number;
    upvotes: number;
    added: number;
    description: string;
    downvotes: number;
    uri: string;
    digital_goods: string;
    score: number;
    name: string;
    id: number;
    href: string;
    sector: string;
    facebook: string;
    twitter: string;
    reddit: string;
    rank: number;
    comments: Comment[];
}
