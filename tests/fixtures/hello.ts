export const helloPrefix = 'Hello';

interface HelloProps {
    name?: string;
};

const Hello = function(props: HelloProps = {}): string {
    if (!props.name) {
        props.name = 'World';
    }

    return `${helloPrefix}, ${props.name}!`;
};

export default Hello;
