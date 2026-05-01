import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PostCard from '../components/PostCard';
import { mockPosts } from '../data/mockData';
import { Post } from '../types';

const DiscoverScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  
  const [filters, setFilters] = useState({
    sortBy: 'latest', 
    dateRange: 'all', 
    minViews: 0,
    showWithImagesOnly: false,
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilters(text, filters);
  };

  const applyFilters = (search: string, currentFilters: typeof filters) => {
    let filtered = [...mockPosts];

    if (search.trim() !== '') {
      filtered = filtered.filter(
        (post) =>
          post.name.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase()) ||
          post.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    filtered = filtered.filter((post) => {
      if (currentFilters.dateRange === 'all') return true;
      
      const postDate = new Date(post.date);
      const postDateTime = postDate.getTime();
      
      switch (currentFilters.dateRange) {
        case 'today':
          return postDateTime >= today.getTime();
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return postDateTime >= weekAgo.getTime();
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return postDateTime >= monthAgo.getTime();
        default:
          return true;
      }
    });

    filtered = filtered.filter((post) => post.views >= currentFilters.minViews);

    switch (currentFilters.sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      sortBy: 'latest',
      dateRange: 'all',
      minViews: 0,
      showWithImagesOnly: false,
    };
    setFilters(defaultFilters);
    applyFilters(searchQuery, defaultFilters);
    setIsFilterModalVisible(false);
  };

  const SidebarMenu = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSidebarVisible}
      onRequestClose={() => setIsSidebarVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsSidebarVisible(false)}
      >
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Menu</Text>
            <TouchableOpacity onPress={() => setIsSidebarVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="home" size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="trending-up" size={24} color="#666" />
              <Text style={styles.menuItemText}>Trending</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="notifications" size={24} color="#666" />
              <Text style={styles.menuItemText}>Notifications</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="bookmark" size={24} color="#666" />
              <Text style={styles.menuItemText}>Saved Posts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="history" size={24} color="#666" />
              <Text style={styles.menuItemText}>History</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <Text style={styles.menuSectionTitle}>Categories</Text>
            
            {['Politics', 'Technology', 'Sports', 'Entertainment', 'Business', 'Health'].map((category) => (
              <TouchableOpacity key={category} style={styles.categoryItem}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="settings" size={24} color="#666" />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="help" size={24} color="#666" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const FilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterModalVisible}
      onRequestClose={() => setIsFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.optionsGroup}>
                {[
                  { value: 'latest', label: 'Latest', icon: 'access-time' },
                  { value: 'popular', label: 'Most Popular', icon: 'trending-up' },
                  { value: 'oldest', label: 'Oldest', icon: 'history' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      filters.sortBy === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => handleFilterChange('sortBy', option.value)}
                  >
                    <Icon 
                      name={option.icon} 
                      size={18} 
                      color={filters.sortBy === option.value ? '#fff' : '#666'} 
                    />
                    <Text
                      style={[
                        styles.optionText,
                        filters.sortBy === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              <View style={styles.optionsGroup}>
                {[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      filters.dateRange === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => handleFilterChange('dateRange', option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.dateRange === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Minimum Views</Text>
              <View style={styles.viewsContainer}>
                {[0, 100, 500, 1000, 5000].map((views) => (
                  <TouchableOpacity
                    key={views}
                    style={[
                      styles.viewsButton,
                      filters.minViews === views && styles.viewsButtonActive,
                    ]}
                    onPress={() => handleFilterChange('minViews', views)}
                  >
                    <Text
                      style={[
                        styles.viewsButtonText,
                        filters.minViews === views && styles.viewsButtonTextActive,
                      ]}
                    >
                      {views === 0 ? 'Any' : `${views}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.switchContainer}>
                <Text style={styles.filterSectionTitle}>Show only posts with images</Text>
                <Switch
                  value={filters.showWithImagesOnly}
                  onValueChange={(value) => handleFilterChange('showWithImagesOnly', value)}
                  trackColor={{ false: '#ddd', true: '#007AFF' }}
                  thumbColor={filters.showWithImagesOnly ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => setIsSidebarVisible(true)} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        
            <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search news, locations, or people..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
        
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)} style={styles.filterButton}>
          <Icon name="filter-list" size={24} color="#fff" />
          {Object.values(filters).some(v => v !== false && v !== 0 && v !== 'latest' && v !== 'all') && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>

      {(filters.dateRange !== 'all' || filters.minViews > 0 || filters.sortBy !== 'latest') && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFilters}>
          {filters.sortBy !== 'latest' && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                Sort: {filters.sortBy === 'popular' ? 'Popular' : 'Oldest'}
              </Text>
              <TouchableOpacity onPress={() => handleFilterChange('sortBy', 'latest')}>
                <Icon name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          
          {filters.dateRange !== 'all' && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                Date: {filters.dateRange === 'today' ? 'Today' : filters.dateRange === 'week' ? 'This Week' : 'This Month'}
              </Text>
              <TouchableOpacity onPress={() => handleFilterChange('dateRange', 'all')}>
                <Icon name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          
          {filters.minViews > 0 && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>Min Views: {filters.minViews}+</Text>
              <TouchableOpacity onPress={() => handleFilterChange('minViews', 0)}>
                <Icon name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#143444" />
      
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No posts found</Text>
            <Text style={styles.emptySubText}>Try adjusting your filters</Text>
            <TouchableOpacity style={styles.resetFiltersBtn} onPress={resetFilters}>
              <Text style={styles.resetFiltersBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <SidebarMenu />
      <FilterModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#143444',
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor:'#143444'
  },
  menuButton: {
    padding: 4,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  filterButton: {
    padding: 4,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    height: 44,
    flex:1,
    paddingHorizontal:5
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  activeFilters: {
    flexDirection: 'row',
    marginTop: 12,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    gap: 8,
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
  resetFiltersBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  resetFiltersBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  badge: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 8,
    backgroundColor: '#f5f5f5',
    marginVertical: 8,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingLeft: 32,
  },
  categoryText: {
    fontSize: 15,
    color: '#333',
  },
  filterModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  viewsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  viewsButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  viewsButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  viewsButtonText: {
    fontSize: 14,
    color: '#666',
  },
  viewsButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default DiscoverScreen;