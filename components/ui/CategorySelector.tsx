import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  position?: 'top-right' | 'top-left';
}

export default function CategorySelector({
  categories,
  selectedCategories,
  onSelectionChange,
  position = 'top-right',
}: CategorySelectorProps) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Synchroniser l'état initial si aucune catégorie n'est sélectionnée mais qu'il y a des catégories
  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      // Initialiser avec toutes les catégories sélectionnées
      onSelectionChange(categories.map((cat) => cat.id));
    }
  }, [categories, selectedCategories.length, onSelectionChange]);

  const toggleCategory = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(categories.map((cat) => cat.id));
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  const selectedCount = selectedCategories.length;
  const totalCount = categories.length;

  return (
    <>
      {/* Bouton flottant */}
      <TouchableOpacity
        style={[styles.floatingButton, position === 'top-left' ? styles.topLeft : styles.topRight]}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <FontAwesome name="filter" size={16} color={theme.colors.text.primary} />
        {selectedCount > 0 && selectedCount < totalCount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{selectedCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal de sélection */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('categorySelector.title')}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                <FontAwesome name="times" size={18} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton} onPress={selectAll}>
                <Text style={styles.actionButtonText}>{t('categorySelector.selectAll')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={deselectAll}>
                <Text style={styles.actionButtonText}>{t('categorySelector.deselectAll')}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoriesList} showsVerticalScrollIndicator={false}>
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
                    onPress={() => toggleCategory(category.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                    <Text style={[styles.categoryName, isSelected && styles.categoryNameSelected]}>
                      {category.name}
                    </Text>
                    <FontAwesome
                      name={isSelected ? 'check-square' : 'square-o'}
                      size={18}
                      color={isSelected ? theme.colors.primary[500] : theme.colors.text.secondary}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.footerText}>
                {selectedCount === 0
                  ? t('categorySelector.noSelection')
                  : selectedCount === totalCount
                    ? t('categorySelector.allSelected')
                    : t('categorySelector.selectedCount', {
                        count: selectedCount,
                        total: totalCount,
                      })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: theme.spacing.lg + 50, // Ajout d'un offset pour éviter le header
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderWidth: 1,
    shadowColor: theme.colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  topRight: {
    right: theme.spacing.lg,
  },
  topLeft: {
    left: theme.spacing.lg,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.primary[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: theme.colors.text.inverted,
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    width: '85%',
    maxHeight: '70%',
    shadowColor: theme.colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    ...theme.typography.small,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  categoriesList: {
    maxHeight: 300,
    paddingHorizontal: theme.spacing.lg,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.sm,
    marginVertical: 2,
  },
  categoryItemSelected: {
    backgroundColor: theme.colors.primary + '10',
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: theme.spacing.sm,
  },
  categoryName: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  categoryNameSelected: {
    fontWeight: '600',
    color: theme.colors.primary[500],
  },
  modalFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
