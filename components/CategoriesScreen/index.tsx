import { useAddCategory, useDeleteCategory } from '@/components/CategoriesScreen/hook';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { useGetCategories } from '@/hooks/useGetCategories';
import { theme } from '@/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const { data: categories = [] } = useGetCategories();
  const { mutate: addCategory } = useAddCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#FF6347');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const reset = () => {
    setLabel('');
    setColor('#FF6347');
    setEditingId(null);
  };

  const submit = () => {
    if (!label.trim()) return;
    addCategory({ label, color });
    reset();
  };

  const onDelete = (id: string) => {
    Alert.alert(t('categories.deleteConfirmation'), t('categories.deleteMessage'), [
      { text: t('categories.cancel'), style: 'cancel' },
      {
        text: t('categories.deleteCategory'),
        style: 'destructive',
        onPress: () => {
          deleteCategory(id);
          if (editingId === id) reset();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: theme.spacing.lg }}>
      <Text style={{ ...theme.typography.title, marginBottom: theme.spacing.sm }}>
        {editingId ? t('categories.editCategory') : t('categories.addCategory')}
      </Text>

      <Field label={t('categories.categoryName')}>
        <Input placeholder={t('categories.categoryName')!} value={label} onChangeText={setLabel} />
      </Field>

      <Field label={t('categories.categoryColor')}>
        <TouchableOpacity onPress={() => setPickerVisible(true)}>
          <View style={styles.colorPreviewRow}>
            <View style={[styles.colorDot, { backgroundColor: color }]} />
            <Text style={styles.colorText}>{t('categories.categoryColor')}</Text>
          </View>
        </TouchableOpacity>
      </Field>

      <View style={{ marginTop: theme.spacing.md }}>
        <Button
          label={editingId ? t('categories.editCategory') : t('categories.addCategory')}
          onPress={submit}
        />
        {editingId && (
          <View style={{ marginTop: theme.spacing.sm }}>
            <Button label={t('categories.cancel')} variant="secondary" onPress={reset} />
          </View>
        )}
      </View>

      <Text style={{ ...theme.typography.subtitle, marginTop: theme.spacing.xl }}>
        {t('categories.title')}
      </Text>
      <FlatList
        style={{ marginTop: theme.spacing.sm }}
        data={categories}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
        renderItem={({ item }) => (
          <Card>
            <TouchableOpacity
              onPress={() => {
                setEditingId(item.id);
                setLabel(item.label);
                setColor(item.color);
              }}
            >
              <View style={styles.itemRow}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.itemLabel}>{item.label}</Text>
                <TouchableOpacity onPress={() => onDelete(item.id)}>
                  <Text style={{ color: theme.colors.danger[600], fontWeight: '700' }}>✕</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Card>
        )}
      />

      <ModalSheet visible={pickerVisible} onClose={() => setPickerVisible(false)}>
        <Text style={{ ...theme.typography.title, marginBottom: theme.spacing.md }}>
          {t('categories.categoryColor')}
        </Text>
        <WheelColorPicker color={color} onColorChangeComplete={(c: string) => setColor(c)} />
        <View style={{ marginTop: theme.spacing.lg }}>
          <Button label={t('common.save')} onPress={() => setPickerVisible(false)} />
          <View style={{ height: theme.spacing.sm }} />
          <Button
            label={t('common.cancel')}
            variant="secondary"
            onPress={() => setPickerVisible(false)}
          />
        </View>
      </ModalSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  colorPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
  },
  colorDot: { width: 20, height: 20, borderRadius: 999, marginRight: theme.spacing.md },
  colorText: { color: theme.colors.text.primary },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: theme.colors.text.primary },
});
