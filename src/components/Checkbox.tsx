import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
  bold?: boolean;
}

export function Checkbox({ label, checked, onToggle, bold = false }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.mark}>✓</Text>}
      </View>
      <Text style={[styles.label, bold && styles.bold]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  mark: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  label: { flex: 1, fontSize: 15, color: colors.text },
  bold: { fontWeight: '700', fontSize: 16 },
});
