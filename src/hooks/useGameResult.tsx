import { useMemo } from 'react';
import { gameIsDone } from '../features/blackjack/blackjackSlice';
import { useAppSelector } from '../redux';
import { HandOwner } from '../types';
import useHandScore from './useHandScore';

export default function useGameResult() {
    const playerScore = useHandScore(HandOwner.Player);
    const houseScore = useHandScore(HandOwner.House);
    const isDone = useAppSelector(gameIsDone);

    return useMemo(() => {
        if (!isDone) {
            return null;
        }

        if (houseScore > 21 && playerScore <= 21) {
            return HandOwner.Player;
        }

        if (playerScore > 21 || playerScore === houseScore || playerScore < houseScore) {
            return HandOwner.House;
        }

        return HandOwner.Player;
    }, [isDone]);
}
