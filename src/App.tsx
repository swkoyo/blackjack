import { Button, Center, Spinner, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useGetDeckQuery, useLazyDrawInitialCardsQuery, useLazyShuffleCardsQuery } from './api';
import MainContainer from './containers/MainContainer';
import BlackjackHand from './features/blackjack/BlackjackHand';
import { getDeckId } from './features/blackjack/blackjackSlice';
import useGameResult from './hooks/useGameResult';
import { useAppSelector } from './redux';
import { HandOwner } from './types';

function App() {
    const [isStarted, setIsStarted] = useState(false);
    const deckId = useAppSelector(getDeckId);
    const result = useGameResult();

    // API hooks
    const { isLoading: getDeckIsLoading, isFetching: getDeckIsFetching, isError: getDeckIsError } = useGetDeckQuery();
    const [
        drawInitialCards,
        {
            isLoading: drawInitialCardsIsLoading,
            isFetching: drawInitialCardsIsFetching,
            isError: drawInitialCardsIsError
        }
    ] = useLazyDrawInitialCardsQuery();
    const [
        shuffleDeck,
        { isLoading: shuffleDeckIsLoading, isFetching: shuffleDeckIsFetching, isError: shuffleDeckIsError }
    ] = useLazyShuffleCardsQuery();

    const isLoading = useMemo(() => {
        if (
            !deckId ||
            getDeckIsLoading ||
            getDeckIsFetching ||
            drawInitialCardsIsLoading ||
            drawInitialCardsIsFetching ||
            shuffleDeckIsLoading ||
            shuffleDeckIsFetching
        ) {
            return true;
        } else {
            return false;
        }
    }, [
        deckId,
        getDeckIsLoading,
        getDeckIsFetching,
        drawInitialCardsIsLoading,
        drawInitialCardsIsFetching,
        shuffleDeckIsFetching,
        shuffleDeckIsLoading
    ]);

    const isError = useMemo(() => {
        if (getDeckIsError || drawInitialCardsIsError || shuffleDeckIsError) {
            return true;
        } else {
            return false;
        }
    }, [getDeckIsError, drawInitialCardsIsError, shuffleDeckIsError]);

    const handleStart = async () => {
        if (deckId) {
            await drawInitialCards(deckId);
            setIsStarted(true);
        }
    };

    const handleRestart = async () => {
        if (deckId) {
            await shuffleDeck(deckId);
            drawInitialCards(deckId);
        }
    };

    if (isError) {
        return (
            <MainContainer>
                <Text>An error occured. Please try again later.</Text>
            </MainContainer>
        );
    }

    if (isLoading) {
        return (
            <MainContainer>
                <Spinner />
            </MainContainer>
        );
    }

    if (!isStarted) {
        return (
            <MainContainer>
                <Button onClick={() => handleStart()}>Start game</Button>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <BlackjackHand owner={HandOwner.House} />
            <Center gap={1} flexDirection='column' h={24} w='100vw' background='blackAlpha.700'>
                {!!result && (
                    <>
                        <Text fontSize='xl' fontWeight='bold' color={result === HandOwner.Player ? 'green' : 'red'}>
                            {result === HandOwner.Player ? 'You win!' : 'You lose'}
                        </Text>
                        <Button onClick={handleRestart} size='sm'>
                            Restart game
                        </Button>
                    </>
                )}
            </Center>
            <BlackjackHand owner={HandOwner.Player} />
        </MainContainer>
    );
}

export default App;
