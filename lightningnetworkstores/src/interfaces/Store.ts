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
    comments: any[];
}