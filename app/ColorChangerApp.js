import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const ColorChangerApp = () => {
    const [backgroundColor, setBackgroundColor] = useState('black');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.title}>Color Changer App</Text>
            <Button title="Set to Black" onPress={() => setBackgroundColor('black')} />
            <Button title="Set to Light Blue" onPress={() => setBackgroundColor('lightblue')} />
            <Button title="Set to Light Green" onPress={() => setBackgroundColor('lightgreen')} />
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
    },
});

export default ColorChangerApp;
