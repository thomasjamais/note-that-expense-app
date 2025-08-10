import { useGetCategories } from '@/hooks/useGetCategories';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import { useAddCategory, useDeleteCategory } from './hook';

type Category = {
  id: string;
  label: string;
  color: string;
};

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const { data: categories } = useGetCategories();
  const { mutate: addCategoryMutation } = useAddCategory();
  const { mutate: deleteCategoryMutation } = useDeleteCategory();
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#FF6347');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const resetForm = () => {
    setLabel('');
    setColor('#FF6347');
    setEditingId(null);
  };

  const handleAddOrUpdate = () => {
    if (!label.trim()) return;

    addCategoryMutation({ label, color });

    resetForm();
  };

  const handleEdit = (category: Category) => {
    setLabel(category.label);
    setColor(category.color);
    setEditingId(category.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert(t('categories.deleteConfirmation'), t('categories.deleteMessage'), [
      { text: t('categories.cancel'), style: 'cancel' },
      {
        text: t('categories.deleteCategory'),
        style: 'destructive',
        onPress: () => {
          deleteCategoryMutation(id);
          if (editingId === id) resetForm();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
      </Text>

      <TextInput style={styles.input} placeholder="Label" value={label} onChangeText={setLabel} />

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[styles.previewColor, { backgroundColor: color }]}
      >
        <Text style={styles.previewText}>{t('categories.categoryColor')}</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 12 }}>
        <Button
          title={editingId ? t('categories.editCategory') : t('categories.addCategory')}
          onPress={handleAddOrUpdate}
        />
        {editingId && (
          <View style={{ marginTop: 8 }}>
            <Button title={t('categories.cancel')} color="#888" onPress={resetForm} />
          </View>
        )}
      </View>

      <Text style={[styles.title, { marginTop: 24 }]}>{t('categories.title')}</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.categoryItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.categoryText}>{item.label}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={{ color: 'red' }}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showPicker} animationType="slide">
        <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' }}>
          <WheelColorPicker
            onColorChangeComplete={(selectedColor) => {
              setColor(selectedColor);
            }}
          />
          <Button title="Valider" onPress={() => setShowPicker(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  previewColor: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  previewText: { color: '#fff', fontWeight: 'bold' },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  categoryText: { fontSize: 16, flex: 1 },
  deleteButton: { marginLeft: 12, padding: 4 },
});
