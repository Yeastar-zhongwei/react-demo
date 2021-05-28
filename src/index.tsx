import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import HomePage from './pages/home';
import OtherPage from './pages/other';

const App: React.FC<{}> = () => (
    <BrowserRouter>
        <div>
            <Route path="/" component={HomePage} exact/>
            <Route path="/other" component={OtherPage} />
        </div>
    </BrowserRouter>
);

ReactDom.render(<App />, document.getElementById('app'));
