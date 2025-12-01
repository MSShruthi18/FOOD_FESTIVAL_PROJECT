import React, { useState, useEffect } from 'react';
import { ChefHat, TrendingUp, Star, Award, DollarSign, Users, Utensils, Music, BarChart3, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const FoodFestivalApp = () => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queryResults, setQueryResults] = useState([]);
  
  const [data, setData] = useState({
    stalls: [
      { _id: '1', name: "Spice Garden", cuisine: "Indian", sales: 45000, liveDemo: true, contests: ["Best Street Food", "Chef's Special"] },
      { _id: '2', name: "Sweet Treats", cuisine: "Desserts", sales: 38000, liveDemo: false, contests: ["Best Dessert"] },
      { _id: '3', name: "Taco Fiesta", cuisine: "Mexican", sales: 52000, liveDemo: true, contests: ["Best Street Food", "Best Dessert", "Chef's Special"] },
      { _id: '4', name: "Pasta Paradise", cuisine: "Italian", sales: 41000, liveDemo: true, contests: ["Chef's Special"] },
      { _id: '5', name: "BBQ Nation", cuisine: "American", sales: 48000, liveDemo: true, contests: ["Best Street Food"] },
      { _id: '6', name: "Sushi Corner", cuisine: "Japanese", sales: 35000, liveDemo: false, contests: [] }
    ],
    dishes: [
      { _id: '1', name: "Butter Chicken", stallId: '1', price: 250, rating: 9.5, soldBy: ['1'] },
      { _id: '2', name: "Gulab Jamun", stallId: '2', price: 80, rating: 9.8, soldBy: ['2', '3'] },
      { _id: '3', name: "Tacos Al Pastor", stallId: '3', price: 180, rating: 9.2, soldBy: ['3'] },
      { _id: '4', name: "Tiramisu", stallId: '2', price: 200, rating: 9.6, soldBy: ['2', '4'] },
      { _id: '5', name: "Margherita Pizza", stallId: '4', price: 300, rating: 8.9, soldBy: ['4'] },
      { _id: '6', name: "BBQ Ribs", stallId: '5', price: 450, rating: 9.4, soldBy: ['5'] },
      { _id: '7', name: "California Roll", stallId: '6', price: 280, rating: 9.1, soldBy: ['6'] },
      { _id: '8', name: "Churros", stallId: '3', price: 120, rating: 9.7, soldBy: ['2', '3'] }
    ],
    visitors: [
      { _id: '1', name: "Raj Kumar", stallsVisited: 6, dishesRated: 12 },
      { _id: '2', name: "Priya Singh", stallsVisited: 7, dishesRated: 15 },
      { _id: '3', name: "Amit Patel", stallsVisited: 4, dishesRated: 8 },
      { _id: '4', name: "Sneha Reddy", stallsVisited: 8, dishesRated: 18 },
      { _id: '5', name: "Vikram Mehta", stallsVisited: 5, dishesRated: 9 }
    ]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stallsRes = await fetch(`${API_URL}/stalls`).then(r => r.json());
      const dishesData = await fetch(`${API_URL}/dishes`).then(r => r.json());
      const visitorsData = await fetch(`${API_URL}/visitors`).then(r => r.json());
      
      setData({
        stalls: stallsRes || data.stalls,
        dishes: dishesData || data.dishes,
        visitors: visitorsData || data.visitors
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const queries = [
    { id: 1, title: "Highest Food Sales", icon: TrendingUp, color: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
    { id: 2, title: "Top Rated Dishes (>9)", icon: Star, color: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)" },
    { id: 3, title: "Multi-Stall Visitors (>5)", icon: Users, color: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" },
    { id: 4, title: "Multi-Contest Winners", icon: Award, color: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
    { id: 5, title: "Average Price Per Stall", icon: DollarSign, color: "linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)" },
    { id: 6, title: "Multi-Stall Dishes", icon: Utensils, color: "linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)" },
    { id: 7, title: "Most Popular Dish", icon: ChefHat, color: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)" },
    { id: 8, title: "Super Raters (>10)", icon: BarChart3, color: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)" },
    { id: 9, title: "Food & Demo Stalls", icon: Music, color: "linear-gradient(135deg, #ec4899 0%, #d946ef 100%)" },
    { id: 10, title: "All-Contest Participants", icon: Award, color: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)" },
    { id: 11, title: "Most Common Cuisine", icon: Utensils, color: "linear-gradient(135deg, #84cc16 0%, #22c55e 100%)" },
    { id: 12, title: "Top 3 Best-Selling", icon: TrendingUp, color: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" }
  ];

  const executeQuery = async (queryId) => {
    setLoading(true);
    setSelectedQuery(queryId);
    
    const query = queries.find(q => q.id === queryId);
    
    try {
      const response = await fetch(`${API_URL}/queries/query${queryId}`);
      const results = await response.json();
      setQueryResults(Array.isArray(results) ? results : [results]);
    } catch (error) {
      console.error('Error fetching query results:', error);
      const results = getQueryResultsLocal(queryId);
      setQueryResults(results);
    }
    
    setLoading(false);
  };

  const getQueryResultsLocal = (queryId) => {
    switch(queryId) {
      case 1:
        return data.stalls.sort((a, b) => b.sales - a.sales);
      case 2:
        return data.dishes.filter(d => d.rating > 9);
      case 3:
        return data.visitors.filter(v => v.stallsVisited > 5);
      case 4:
        return data.stalls.filter(s => s.contests.length > 1);
      case 5:
        // FIX: Generating random price between 150 and 650 as requested
        return data.stalls.map(s => ({
          ...s,
          avgPrice: Math.floor(Math.random() * (650 - 150 + 1)) + 150
        }));
      case 6:
        // FIX: Added check for 'd.soldBy' existence
        return data.dishes.filter(d => d.soldBy && d.soldBy.length > 1);
      case 7:
        return [data.dishes.reduce((max, d) => d.rating > max.rating ? d : max, data.dishes[0])];
      case 8:
        return data.visitors.filter(v => v.dishesRated > 10);
      case 9:
        return data.stalls.filter(s => s.liveDemo);
      case 10:
        return data.stalls.filter(s => s.contests.length === 3);
      case 11:
        const cuisineCount = data.stalls.reduce((acc, s) => {
          acc[s.cuisine] = (acc[s.cuisine] || 0) + 1;
          return acc;
        }, {});
        const mostCommon = Object.entries(cuisineCount).sort((a, b) => b[1] - a[1])[0];
        return [{ _id: mostCommon[0], count: mostCommon[1] }];
      case 12:
        return data.stalls.sort((a, b) => b.sales - a.sales).slice(0, 3);
      default:
        return [];
    }
  };

  const renderResults = () => {
    if (!selectedQuery || queryResults.length === 0) return null;
    
    const query = queries.find(q => q.id === selectedQuery);

    return (
      <div style={styles.resultsContainer}>
        <div style={styles.resultsHeader}>
          <div style={styles.resultsHeaderContent}>
            <div style={{...styles.iconBox, background: query.color}}>
              <query.icon style={styles.icon} />
            </div>
            <h3 style={styles.resultsTitle}>{query.title}</h3>
          </div>
          <span style={styles.resultCount}>{queryResults.length} results</span>
        </div>
        
        <div style={styles.resultsList}>
          {queryResults.map((item, idx) => (
            <div key={idx} style={styles.resultCard}>
              {selectedQuery === 1 && (
                <div style={styles.resultRow}>
                  <div>
                    <span style={styles.stallName}>{item.name}</span>
                    <span style={styles.cuisine}>({item.cuisine})</span>
                  </div>
                  <span style={styles.sales}>₹{item.sales.toLocaleString()}</span>
                </div>
              )}
              {selectedQuery === 2 && (
                <div style={styles.resultRow}>
                  <span style={styles.dishName}>{item.name}</span>
                  <div style={styles.ratingBox}>
                    <span style={styles.rating}>{item.rating}</span>
                    <Star style={styles.starIcon} fill="#f59e0b" color="#f59e0b" />
                  </div>
                </div>
              )}
              {selectedQuery === 3 && (
                <div style={styles.resultRow}>
                  <span style={styles.visitorName}>{item.name}</span>
                  <span style={styles.stallsVisited}>{item.stallsVisited} stalls visited</span>
                </div>
              )}
              {selectedQuery === 4 && (
                <div>
                  <div style={styles.contestWinner}>{item.name}</div>
                  <div style={styles.contestBadges}>
                    {item.contests.map((c, i) => (
                      <span key={i} style={styles.badge}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedQuery === 5 && (
                <div style={styles.resultRow}>
                  <span style={styles.stallName}>{item.name}</span>
                  <span style={styles.avgPrice}>₹{item.avgPrice || 0}</span>
                </div>
              )}
              {selectedQuery === 6 && (
                <div style={styles.resultRow}>
                  <span style={styles.dishName}>{item.name}</span>
                  <span style={styles.stallCount}>{item.soldBy?.length || 0} stalls</span>
                </div>
              )}
              {selectedQuery === 7 && (
                <div style={styles.resultRow}>
                  <span style={styles.popularDish}>{item.name}</span>
                  <div style={styles.ratingBox}>
                    <span style={styles.popularRating}>{item.rating}</span>
                    <Star style={styles.starIconLarge} fill="#f97316" color="#f97316" />
                  </div>
                </div>
              )}
              {selectedQuery === 8 && (
                <div style={styles.resultRow}>
                  <span style={styles.visitorName}>{item.name}</span>
                  <span style={styles.dishesRated}>{item.dishesRated} dishes rated</span>
                </div>
              )}
              {selectedQuery === 9 && (
                <div style={styles.resultRow}>
                  <div>
                    <span style={styles.stallName}>{item.name}</span>
                    <span style={styles.cuisine}>({item.cuisine})</span>
                  </div>
                  <Music style={{width: 20, height: 20, color: '#ec4899'}} />
                </div>
              )}
              {selectedQuery === 10 && (
                <div style={styles.resultRow}>
                  <span style={styles.stallName}>{item.name}</span>
                  <span style={styles.allContests}>All {item.contests.length} contests</span>
                </div>
              )}
              {selectedQuery === 11 && (
                <div style={styles.resultRow}>
                  <span style={styles.cuisineType}>{item._id || item.cuisine}</span>
                  <span style={styles.cuisineCount}>{item.count} stalls</span>
                </div>
              )}
              {selectedQuery === 12 && (
                <div style={styles.resultRow}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 15}}>
                    <span style={styles.rank}>#{idx + 1}</span>
                    <div>
                      <div style={styles.stallName}>{item.name}</div>
                      <div style={styles.smallCuisine}>{item.cuisine}</div>
                    </div>
                  </div>
                  <span style={styles.topSales}>₹{item.sales.toLocaleString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 50%, #fce7f3 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #ec4899 100%)',
      color: 'white',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '32px 24px'
    },
    headerContent: {
      maxWidth: 1280,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    },
    headerIconBox: {
      padding: 16,
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 16,
      backdropFilter: 'blur(10px)'
    },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      margin: 0
    },
    subtitle: {
      color: '#fed7aa',
      marginTop: 4,
      fontSize: 14
    },
    refreshButton: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: 8,
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    statsSection: {
      maxWidth: 1280,
      margin: '-32px auto 32px',
      padding: '0 24px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 24
    },
    statCard: {
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    statInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    statLabel: {
      color: '#6b7280',
      fontSize: 14
    },
    statValue: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#1f2937'
    },
    mainContent: {
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 24px 48px'
    },
    card: {
      background: 'white',
      borderRadius: 16,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: 32
    },
    cardTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 24
    },
    queryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 16
    },
    queryButton: {
      padding: 24,
      borderRadius: 12,
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    },
    queryButtonInactive: {
      background: '#f9fafb',
      color: '#1f2937'
    },
    queryButtonActive: {
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)'
    },
    queryInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    queryTitle: {
      fontWeight: '600',
      fontSize: 14
    },
    queryNumber: {
      fontSize: 12,
      opacity: 0.8,
      marginTop: 2
    },
    loader: {
      marginTop: 32,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 48
    },
    spinner: {
      width: 48,
      height: 48,
      border: '4px solid #ea580c',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    resultsContainer: {
      marginTop: 24,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: 24
    },
    resultsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    resultsHeaderContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    },
    iconBox: {
      padding: 12,
      borderRadius: 8
    },
    icon: {
      width: 24,
      height: 24,
      color: 'white'
    },
    resultsTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
    },
    resultCount: {
      fontSize: 14,
      color: '#6b7280'
    },
    resultsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    },
    resultCard: {
      padding: 16,
      background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
      borderRadius: 8,
      border: '1px solid #e5e7eb',
      transition: 'all 0.3s'
    },
    resultRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    stallName: {
      fontWeight: '600',
      fontSize: 16,
      color: '#1f2937'
    },
    cuisine: {
      marginLeft: 8,
      fontSize: 14,
      color: '#6b7280'
    },
    sales: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#10b981'
    },
    dishName: {
      fontWeight: '600',
      color: '#1f2937'
    },
    ratingBox: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    rating: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#f59e0b'
    },
    starIcon: {
      width: 20,
      height: 20
    },
    visitorName: {
      fontWeight: '600',
      color: '#1f2937'
    },
    stallsVisited: {
      color: '#3b82f6',
      fontWeight: '500'
    },
    contestWinner: {
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 8
    },
    contestBadges: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    },
    badge: {
      padding: '4px 12px',
      background: '#f3e8ff',
      color: '#7c3aed',
      borderRadius: 16,
      fontSize: 12
    },
    avgPrice: {
      color: '#06b6d4',
      fontWeight: 'bold'
    },
    stallCount: {
      color: '#ef4444',
      fontWeight: '500'
    },
    popularDish: {
      fontWeight: '600',
      fontSize: 18,
      color: '#1f2937'
    },
    popularRating: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#f97316'
    },
    starIconLarge: {
      width: 24,
      height: 24
    },
    dishesRated: {
      color: '#8b5cf6',
      fontWeight: '500'
    },
    allContests: {
      color: '#6366f1',
      fontWeight: '500'
    },
    cuisineType: {
      fontWeight: '600',
      fontSize: 18,
      color: '#1f2937'
    },
    cuisineCount: {
      color: '#84cc16',
      fontWeight: 'bold'
    },
    rank: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#9ca3af'
    },
    smallCuisine: {
      fontSize: 14,
      color: '#6b7280'
    },
    topSales: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#10b981'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        button:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .result-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
      
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIconBox}>
              <ChefHat style={{width: 48, height: 48}} />
            </div>
            <div>
              <h1 style={styles.title}>Food Festival 2025</h1>
              <p style={styles.subtitle}>Management & Analytics Dashboard</p>
            </div>
          </div>
          <button style={styles.refreshButton} onClick={fetchData}>
            <RefreshCw style={{width: 20, height: 20}} />
            Refresh Data
          </button>
        </div>
      </div>

      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, borderLeft: '4px solid #ea580c'}}>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Stalls</p>
              <p style={styles.statValue}>{data.stalls.length}</p>
            </div>
            <Utensils style={{width: 40, height: 40, color: '#ea580c'}} />
          </div>
          <div style={{...styles.statCard, borderLeft: '4px solid #10b981'}}>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Total Sales</p>
              <p style={styles.statValue}>₹{data.stalls.reduce((sum, s) => sum + s.sales, 0).toLocaleString()}</p>
            </div>
            <DollarSign style={{width: 40, height: 40, color: '#10b981'}} />
          </div>
          <div style={{...styles.statCard, borderLeft: '4px solid #3b82f6'}}>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Visitors</p>
              <p style={styles.statValue}>{data.visitors.length}</p>
            </div>
            <Users style={{width: 40, height: 40, color: '#3b82f6'}} />
          </div>
          <div style={{...styles.statCard, borderLeft: '4px solid #a855f7'}}>
            <div style={styles.statInfo}>
              <p style={styles.statLabel}>Dishes</p>
              <p style={styles.statValue}>{data.dishes.length}</p>
            </div>
            <ChefHat style={{width: 40, height: 40, color: '#a855f7'}} />
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Query Analytics</h2>
          
          <div style={styles.queryGrid}>
            {queries.map((query) => (
              <button
                key={query.id}
                onClick={() => executeQuery(query.id)}
                style={{
                  ...styles.queryButton,
                  ...(selectedQuery === query.id 
                    ? {...styles.queryButtonActive, background: query.color}
                    : styles.queryButtonInactive)
                }}
              >
                <query.icon style={{width: 32, height: 32, color: selectedQuery === query.id ? 'white' : '#6b7280'}} />
                <div style={styles.queryInfo}>
                  <h3 style={styles.queryTitle}>{query.title}</h3>
                  <p style={styles.queryNumber}>Query {query.id}</p>
                </div>
              </button>
            ))}
          </div>

          {loading ? (
            <div style={styles.loader}>
              <div style={styles.spinner}></div>
            </div>
          ) : (
            renderResults()
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodFestivalApp;