import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    category1 => category1.id === product.categoryId,
  );
  const user = usersFromServer.find(user1 => user1.id === category.ownerId);

  return { ...product, user, category };
});

const [selectedOwner, setSelectedOwner] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [query, setQuery] = useState('');

const filteredProducts = products.filter((product) => {
  const isSelectedOwner = product.user.name === selectedOwner;
  const isSelectedCategory = product.category.title === selectedCategory;
  const doesNameIncludeQuery = product.name.includes(query.trim());

  return isSelectedOwner && isSelectedCategory && doesNameIncludeQuery;
});

export const App = () => (
  <div className="section">
    <div className="container">
      <h1 className="title">Product Categories</h1>

      <div className="block">
        <nav className="panel">
          <p className="panel-heading">Filters</p>

          <p className="panel-tabs has-text-weight-bold">
            <a
              data-cy="FilterAllUsers"
              href="#/"
              onClick={() => {
                setSelectedOwner('');
              }}
            >
              All
            </a>

            {usersFromServer.map(user => (
              <a
                data-cy="FilterUser"
                href="#/"
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('');
                  setSelectedOwner(user.name);
                }}
              >
                {user.name}
              </a>
            ))}
          </p>

          <div className="panel-block">
            <p className="control has-icons-left has-icons-right">
              <input
                data-cy="SearchField"
                type="text"
                className="input"
                placeholder="Search"
                value=""
              />

              <span className="icon is-left">
                <i className="fas fa-search" aria-hidden="true" />
              </span>

              <span className="icon is-right">
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <button
                  data-cy="ClearButton"
                  type="button"
                  className="delete"
                />
              </span>
            </p>
          </div>

          <div className="panel-block is-flex-wrap-wrap">
            <a
              href="#/"
              data-cy="AllCategories"
              className="button is-success mr-6 is-outlined"
            >
              All
            </a>

            {categoriesFromServer.map(category => (
              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                {category.title}
              </a>
            ))}
          </div>

          <div className="panel-block">
            <a
              data-cy="ResetAllButton"
              href="#/"
              className="button is-link is-outlined is-fullwidth"
              onClick={() => {
                setQuery('');
                setSelectedCategory('');
                setSelectedOwner('');
              }}
            >
              Reset all filters
            </a>
          </div>
        </nav>
      </div>

      <div className="box table-container">
        {(filteredProducts.length === 0)
          ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )

          : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {['ID', 'Product', 'Category', 'User'].map(sortByValue => (
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {sortByValue}

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-danger': product.user.sex === 'f',
                        'has-text-link': product.user.sex === 'm',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  </div>
);
