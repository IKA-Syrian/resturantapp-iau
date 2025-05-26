import React from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    return (
        <SafeAreaView style={styles.container}>
            {error ? (
                <View style={styles.center}>
                    <Text style={{ color: 'red', fontSize: 16 }}>Failed to load the website.</Text>
                </View>
            ) : (
                <WebView
                    source={{ uri: 'http://192.168.1.33:8080' }} // Change to your deployed URL for production
                    style={styles.webview}
                    onLoadEnd={() => setLoading(false)}
                    onError={() => setError(true)}
                />
            )}
            {loading && !error && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#FF4500" />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
