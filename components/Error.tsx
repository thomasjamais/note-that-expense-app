import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Une erreur est survenue :</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
          <Text style={styles.message}>
            {this.state.error.cause ? String(this.state.error.cause) : null}
          </Text>
          <Text style={styles.message}>
            {this.state.error.name ? String(this.state.error.name) : null}
          </Text>
          <Text style={styles.message}>
            {this.state.error.stack ? String(this.state.error.stack) : null}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontWeight: 'bold', marginBottom: 8 },
  message: { textAlign: 'center' },
});
