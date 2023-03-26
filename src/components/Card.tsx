import { Box, Image } from '@chakra-ui/react';

type Props = {
    image: string;
    code: string;
    height?: string;
    width?: string;
    minWidth?: string;
};

export default function Card({ image, code, height, width, minWidth }: Props) {
    return (
        <Image
            height={height}
            width={width}
            minWidth={minWidth}
            src={image}
            alt={code}
            fallback={
                <Box
                    height={height}
                    width={width}
                    minWidth={minWidth}
                    border='1px'
                    borderRadius='lg'
                    background='white'
                    p={2}
                >
                    <Box w='full' borderRadius='lg' h='full' background='black' />
                </Box>
            }
        />
    );
}
