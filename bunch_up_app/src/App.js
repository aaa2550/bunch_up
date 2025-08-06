import React from 'react';
import {Provider} from 'react-redux';
import {store} from './store';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CategoryScreen from './screens/CategoryScreen';
import ChatScreen from './screens/ChatScreen';

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
      }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
  return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#ffffff',
          padding: 20,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <h1 style={{color: '#ff4757', marginBottom: 10}}>应用出现错误</h1>
          <p style={{color: '#666666', textAlign: 'center'}}>请刷新页面重试</p>
          <pre style={{color: '#999999', fontSize: 12, marginTop: 20}}>
            {this.state.error?.toString()}
          </pre>
        </div>
  );
    }

    return this.props.children;
  }
}

// 简单的导航模拟
const SimpleNavigator = () => {
  const [currentScreen, setCurrentScreen] = React.useState('Login');
  const [currentCategory, setCurrentCategory] = React.useState(null);
  
  const navigation = {
    navigate: (screen, params) => {
      setCurrentScreen(screen);
      if (params && params.category) {
        setCurrentCategory(params.category);
      }
    },
    replace: (screen) => setCurrentScreen(screen),
    reset: (config) => {
      if (config.routes && config.routes.length > 0) {
        setCurrentScreen(config.routes[0].name);
      }
    },
    goBack: () => {
      if (currentScreen === 'Chat') {
        setCurrentScreen('Category');
      } else if (currentScreen === 'Category') {
        setCurrentScreen('Login');
      }
    }
  };

  if (currentScreen === 'Login') {
    return <LoginScreen navigation={navigation} />;
    }
    
  if (currentScreen === 'Register') {
    return <RegisterScreen navigation={navigation} />;
  }

  if (currentScreen === 'Category') {
    return <CategoryScreen navigation={navigation} />;
  }

  if (currentScreen === 'Chat') {
    return <ChatScreen navigation={navigation} route={{params: {category: currentCategory}}} />;
    }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px 0'
    }}>
      <div style={{
        width: 400,
        maxWidth: '90%',
        padding: 40,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        textAlign: 'center'
      }}>
        <h1 style={{color: '#333333', marginBottom: 20, fontSize: 24}}>其他页面</h1>
        <p style={{color: '#666666', marginBottom: 20}}>这是其他页面的内容</p>
        <button 
          onClick={() => setCurrentScreen('Login')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          返回登录
        </button>
      </div>
    </div>
  );
};

const App = () => {
  console.log('App component rendering');
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SimpleNavigator />
      </Provider>
    </ErrorBoundary>
  );
};

export default App; 