import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ICard, IDeck } from '../types';

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://deckofcardsapi.com/api/deck'
});

interface IBaseResponse {
    success: boolean;
}

interface IDeckResponse extends IBaseResponse, IDeck {}

interface ICardsResponse extends IBaseResponse, Pick<IDeck, 'deck_id' | 'remaining'> {
    cards: ICard[];
}

const api = createApi({
    baseQuery,
    endpoints: (builder) => ({
        getDeck: builder.query<IDeckResponse, void>({
            query: () => ({
                method: 'GET',
                url: '/new/shuffle'
            })
        }),
        drawInitialCards: builder.query<ICardsResponse, string>({
            query: (deckId) => ({
                method: 'GET',
                url: `/${deckId}/draw`,
                params: {
                    count: 4
                }
            })
        }),
        drawPlayerCard: builder.query<ICardsResponse, string>({
            query: (deckId) => ({
                method: 'GET',
                url: `/${deckId}/draw`,
                params: {
                    count: 1
                }
            })
        }),
        drawHouseCard: builder.query<ICardsResponse, string>({
            query: (deckId) => ({
                method: 'GET',
                url: `/${deckId}/draw`,
                params: {
                    count: 1
                }
            })
        }),
        shuffleCards: builder.query<IDeckResponse, string>({
            query: (deckId) => ({
                method: 'GET',
                url: `/${deckId}/shuffle`
            })
        })
    })
});

export const {
    useGetDeckQuery,
    useLazyDrawInitialCardsQuery,
    useLazyDrawPlayerCardQuery,
    useLazyShuffleCardsQuery,
    useLazyDrawHouseCardQuery
} = api;

export default api;
