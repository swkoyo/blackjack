import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import type { RootState } from '../../redux';
import { HandOwner, ICard, IDeck } from '../../types';

type BlackjackState = {
    deckId: IDeck['deck_id'] | null;
    playerHand: ICard[];
    houseHand: ICard[];
    playerIsDone: boolean;
    isDone: boolean;
};

const initialState: BlackjackState = {
    deckId: null,
    playerHand: [],
    houseHand: [],
    playerIsDone: false,
    isDone: false
};

export const blackjackSlice = createSlice({
    name: 'blackjack',
    initialState,
    reducers: {
        setIsDone: (state, action: PayloadAction<boolean>) => {
            state.isDone = action.payload;
        },
        setPlayerIsDone: (state) => {
            state.playerIsDone = true;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(api.endpoints.getDeck.matchFulfilled, (state, action) => {
            state.deckId = action.payload.deck_id;
        }),
            builder.addMatcher(api.endpoints.drawInitialCards.matchFulfilled, (state, action) => {
                const { cards } = action.payload;
                state.playerHand = [cards[0], cards[2]];
                state.houseHand = [cards[1], cards[3]];
            }),
            builder.addMatcher(api.endpoints.drawPlayerCard.matchFulfilled, (state, action) => {
                const {
                    cards: [card]
                } = action.payload;
                state.playerHand = [...state.playerHand, card];
            }),
            builder.addMatcher(api.endpoints.drawHouseCard.matchFulfilled, (state, action) => {
                const {
                    cards: [card]
                } = action.payload;
                state.houseHand = [...state.houseHand, card];
            }),
            builder.addMatcher(api.endpoints.shuffleCards.matchFulfilled, (state) => {
                return {
                    ...state,
                    playerHand: [],
                    houseHand: [],
                    isDone: false,
                    playerIsDone: false
                };
            });
    }
});

export const { setIsDone, setPlayerIsDone } = blackjackSlice.actions;

export const gameIsDone = (state: RootState) => state.blackjack.isDone;
export const getPlayerIsDone = (state: RootState) => state.blackjack.playerIsDone;
export const getDeckId = (state: RootState) => state.blackjack.deckId;
export const getOwnerCards = (owner: HandOwner) => (state: RootState) => {
    if (owner === HandOwner.Player) {
        return state.blackjack.playerHand;
    } else {
        return state.blackjack.houseHand;
    }
};

export default blackjackSlice.reducer;
