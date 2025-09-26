import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const CounterApp = () => {
    const [count, setCount] = useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Counter App</Text>
            <Text style={styles.counter}>{count}</Text>
            <Button title="Increment" onPress={() => setCount(count + 1)} />
            <Button title="Decrement" onPress={() => setCount(count - 1)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'green',
    },
    counter: {
        fontSize: 48,
        marginBottom: 20,
        color: 'lightgreen',
    },
});

export default CounterApp;
