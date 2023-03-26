import { useMemo } from 'react';
import { getOwnerCards } from '../features/blackjack/blackjackSlice';
import { useAppSelector } from '../redux';
import { HandOwner } from '../types';

export default function useHandScore(owner: HandOwner) {
    const cards = useAppSelector(getOwnerCards(owner));
    return useMemo(() => {
        let score = 0;
        let hasAce = false;

        for (const { value } of cards) {
            switch (value) {
                case 'KING':
                case 'QUEEN':
                case 'JACK':
                case '10':
                    score += 10;
                    break;
                case 'ACE':
                    score += 1;
                    hasAce = true;
                    break;
                default:
                    score += parseInt(value);
                    break;
            }
        }

        if (hasAce && score < 12) {
            score += 10;
        }
        return score;
    }, [cards]);
}
