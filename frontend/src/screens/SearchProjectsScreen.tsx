import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import debounce from 'lodash.debounce';

import { portfolioApi } from '../services/api';
import { Project } from '../types/api';
import { SearchProjectsScreenProps } from '../types/navigation';

const SearchProjectsScreen: React.FC<SearchProjectsScreenProps> = () => {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search function to avoid too many API calls when typing
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim()) {
        fetchProjects(searchQuery, 0);
      } else {
        setProjects([]);
        setHasMore(true);
        setPage(0);
      }
    }, 500),
    []
  );

  // Effect for search query changes
  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  // Reset search when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Initialize with empty search or popular projects
      if (query.trim()) {
        fetchProjects(query, 0);
      }
      return () => {}; // Cleanup function
    }, [])
  );

  // Fetch projects from API
  const fetchProjects = async (searchQuery: string, pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await portfolioApi.searchProjects(searchQuery, pageNum);
      
      if (pageNum === 0) {
        setProjects(results);
      } else {
        setProjects(prev => [...prev, ...results]);
      }
      
      setHasMore(results.length > 0);
      setPage(pageNum);
    } catch (err: any) {
      setError('Failed to load projects. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load more projects when scrolling to the end
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProjects(query, page + 1);
    }
  };

  // Render the tech tags for each project
  const renderTechTags = (technologies: string[]) => {
    return (
      <View style={styles.techContainer}>
        {technologies.slice(0, 3).map((tech, index) => (
          <View key={index} style={styles.techTag}>
            <Text style={styles.techTagText}>{tech}</Text>
          </View>
        ))}
        {technologies.length > 3 && (
          <View style={styles.techTag}>
            <Text style={styles.techTagText}>+{technologies.length - 3}</Text>
          </View>
        )}
      </View>
    );
  };

  // Render each project item
  const renderProjectItem = ({ item }: { item: Project }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <View style={styles.freelancerBadge}>
          <Text style={styles.freelancerText}>{item.freelancer.specialization}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {item.description || 'No description provided'}
      </Text>
      
      {renderTechTags(item.technologiesUsed)}
      
      <View style={styles.freelancerInfo}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {item.freelancer.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.freelancerDetails}>
          <Text style={styles.freelancerName}>{item.freelancer.name}</Text>
          <Text style={styles.freelancerEmail}>{item.freelancer.email}</Text>
        </View>
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {query.trim() === '' ? (
        <>
          <Text style={styles.emptyTitle}>Search for Projects</Text>
          <Text style={styles.emptyText}>
            Enter a technology or project title to find relevant projects from freelancers
          </Text>
        </>
      ) : loading ? (
        <ActivityIndicator size="large" color="#5046E5" />
      ) : (
        <>
          <Text style={styles.emptyTitle}>No Projects Found</Text>
          <Text style={styles.emptyText}>
            No projects match your search criteria. Try a different search term.
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or technology..."
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchProjects(query, 0)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading && projects.length > 0 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#5046E5" />
              <Text style={styles.loaderText}>Loading more projects...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  freelancerBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  freelancerText: {
    fontSize: 12,
    color: '#5046E5',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  techTag: {
    backgroundColor: '#5046E530',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  techTagText: {
    fontSize: 12,
    color: '#5046E5',
  },
  freelancerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5046E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  freelancerDetails: {
    flex: 1,
  },
  freelancerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  freelancerEmail: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    flex: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#FFE8E8',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#D03030',
    flex: 1,
  },
  retryText: {
    color: '#5046E5',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loaderContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loaderText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

export default SearchProjectsScreen; 