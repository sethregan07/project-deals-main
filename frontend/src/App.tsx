
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Products/Products";
import Header from "./Pages/Header/Header.tsx";
import '@mantine/core/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import HomePage from "./Pages/Home/HomePage.tsx";
import AuthenticationForm from "./Pages/Login/AuthenticationForm.tsx";
import Products from "./Pages/Products/Products.tsx";
import FooterLinks from "./Pages/Footer/FooterLinks.tsx";
import ProductPage from "./Pages/ProductPage/ProductPage.tsx";
import CatelogPage from "./Pages/CatelogPage/CatelogPage.tsx";
import ComparisionPage from "./Pages/ComparisionPage/ComparisionPage.tsx";
// import FilterSearch from "./Pages/FilterSearch/FilterSearch.tsx";
import About from "./Pages/About/index.tsx";
import { ContactUs } from "./Pages/ContactPage/ContactUs.tsx";
import Articles from './Pages/Articles/index.tsx';
import ArticleDetail from './Pages/Articles/ArticleDetail.tsx';
import AITools from './Pages/AITools/index.tsx';
import TechTools from './Pages/TechTools/TechTools.tsx';
import TechToolsCategory from './Pages/TechTools/TechToolsCategory.tsx';
import TechToolDetail from './Pages/TechTools/TechToolDetail.tsx';
import TechToolsCompare from './Pages/TechTools/TechToolsCompare.tsx';

import Deals from "../src/Pages/Categories/Deals/index.tsx"
import News from "../src/Pages/Categories/News/index.tsx"


function App() {
  return (

    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<AuthenticationForm/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path="/products/:productId" element={<ProductPage />} />
        {/* <Route path="/catelog" element={<CatelogPage/>}/> */}
        {/* <Route path='/filter' element={<FilterSearch/>}/> */}
        <Route path="/deals" element={<Deals/>}/>
        <Route path="/news" element={<News/>}/>
        <Route path="/compare" element={<ComparisionPage/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/articles" element={<Articles/>}/>
        <Route path="/articles/:id" element={<ArticleDetail/>}/>
        <Route path="/ai-tools" element={<AITools/>}/>
        <Route path="/tech-tools" element={<TechTools/>}/>
        <Route path="/tech-tools/:category" element={<TechToolsCategory/>}/>
        <Route path="/tech-tool/:id" element={<TechToolDetail/>}/>
        <Route path="/tech-tools/compare" element={<TechToolsCompare/>}/>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
