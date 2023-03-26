import { Box, Button, Center, Flex, HStack, Text, useToast, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLazyDrawHouseCardQuery, useLazyDrawPlayerCardQuery } from '../../api';
import Card from '../../components/Card';
import { calculateHandScore } from '../../helper';
import useGameResult from '../../hooks/useGameResult';
import useHandScore from '../../hooks/useHandScore';
import { useAppDispatch, useAppSelector } from '../../redux';
import { HandOwner } from '../../types';
import { getDeckId, getOwnerCards, getPlayerIsDone, setIsDone, setPlayerIsDone } from './blackjackSlice';

type Props = {
    owner: HandOwner;
};

export default function BlackjackHand({ owner }: Props) {
    const cards = useAppSelector(getOwnerCards(owner));
    const score = useHandScore(owner);
    const deckId = useAppSelector(getDeckId);
    const [drawCard, { isLoading: drawCardIsLoading, isFetching: drawCardIsFetching, isError: drawCardIsError }] =
        useLazyDrawPlayerCardQuery();
    const [
        drawHouseCard,
        { isLoading: drawHouseCardIsLoading, isFetching: drawHouseCardIsFetching, isError: drawHouseCardIsError }
    ] = useLazyDrawHouseCardQuery();
    const toast = useToast();
    const dispatch = useAppDispatch();
    const result = useGameResult();
    const playerIsDone = useAppSelector(getPlayerIsDone);

    const handleHit = () => {
        if (deckId) {
            drawCard(deckId);
        }
    };

    const handleStand = () => {
        dispatch(setPlayerIsDone());
    };

    useEffect(() => {
        if (drawCardIsError) {
            toast({
                title: 'An error occured while drawing a card. Please try again',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    }, [drawCardIsError]);

    useEffect(() => {
        if ((owner === HandOwner.Player && score > 21) || (playerIsDone && owner === HandOwner.House && score >= 17)) {
            dispatch(setIsDone(true));
        }
    }, [score, playerIsDone]);

    useEffect(() => {
        (async () => {
            if (playerIsDone && owner === HandOwner.House && score < 17) {
                const currentCards = [...cards];
                let currentScore = calculateHandScore(currentCards);
                while (currentScore < 17) {
                    const data = await drawHouseCard(deckId as string).unwrap();
                    currentCards.push(data.cards[0]);
                    currentScore = calculateHandScore(currentCards);
                }
            }
        })();
    }, [playerIsDone]);

    return (
        <VStack gap={4}>
            <HStack>
                <Text fontWeight='bold' fontSize='2xl'>
                    {owner}
                </Text>
                <Center borderRadius='full' w='30px' p={1} background='blackAlpha.600'>
                    <Text fontWeight='bold'>{score}</Text>
                </Center>
            </HStack>
            <Flex
                sx={{
                    width: '80%',
                    maxW: '60rem'
                }}
            >
                {cards.map((card) => (
                    <Box
                        key={card.code}
                        sx={{
                            overflow: 'hidden',
                            _last: {
                                overflow: 'visible'
                            }
                        }}
                    >
                        <Card image={card.image} code={card.code} height='14em' width='10em' minWidth='10em' />
                    </Box>
                ))}
            </Flex>
            {owner === HandOwner.Player && (
                <HStack>
                    <Button disabled={!!result} onClick={handleHit} isLoading={drawCardIsLoading || drawCardIsFetching}>
                        Hit
                    </Button>
                    <Button disabled={!!result} onClick={handleStand}>
                        Stand
                    </Button>
                </HStack>
            )}
        </VStack>
    );
}
