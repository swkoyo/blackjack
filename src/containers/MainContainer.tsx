import { Center, Text, VStack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export default function MainContainer({ children }: PropsWithChildren<object>) {
    return (
        <VStack w='100vw' h='100vh' background='board' gap={10} pt={10}>
            <Text fontSize='5xl' fontWeight='bold'>
                Blackjack
            </Text>
            <Center flexDirection='column' gap={10}>
                {children}
            </Center>
        </VStack>
    );
}
