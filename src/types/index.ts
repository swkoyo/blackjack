export interface ICard {
    code: string;
    image: string;
    images: {
        svg: string;
        png: string;
    };
    value: string;
    suit: string;
}

export interface IDeck {
    deck_id: string;
    shuffled: boolean;
    remaining: number;
}

export enum HandOwner {
    Player = 'Player',
    House = 'House'
}
