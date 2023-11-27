import { useState } from 'react';
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

export const App = () => {
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortCounter, setSortCounter] = useState(0);

  const sortedProducts = products.sort((product1, product2) => {
    let first = product1;
    let second = product2;

    if (sortCounter !== 0) {
      first = (sortCounter % 2 === 1) ? product1 : product2;
      second = (sortCounter % 2 === 0) ? product1 : product2;
    }

    switch (sortBy) {
      case 'ID':
        return first.id - second.id;

      case 'Product':
        return first.name.localeCompare(second.name);

      case 'Category':
        return first.category.title.localeCompare(second.category.title);

      case 'User':
        return first.user.name.localeCompare(second.user.name);

      default:
        return 0;
    }
  });

  const filteredProducts = sortedProducts.filter((product) => {
    let isSelectedOwner = product.user.name === selectedOwner;
    let isSelectedCategory = product.category.title === selectedCategory;
    let doesNameIncludeQuery = product.name.toLowerCase().includes(
      query.toLowerCase().trim(),
    );

    if (!selectedOwner) {
      isSelectedOwner = true;
    }

    if (!selectedCategory) {
      isSelectedCategory = true;
    }

    if (!query) {
      doesNameIncludeQuery = true;
    }

    return isSelectedOwner && isSelectedCategory && doesNameIncludeQuery;
  });

  return (
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
                className={cn({ 'is-active': selectedOwner === '' })}
                onClick={() => (
                  setSelectedOwner('')
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': selectedOwner === user.name })}
                  onClick={() => (
                    setSelectedOwner(user.name)
                  )}
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
                  value={query}
                  onChange={event => (setQuery(event.currentTarget.value))}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => (setQuery(''))}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn(
                  'button',
                  'is-success',
                  'mr-6',
                  { 'is-outlined': selectedCategory !== '' },
                )}
                onClick={() => (
                  setSelectedCategory('')
                )}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn(
                    'button',
                    'mr-2',
                    'my-1',
                    { 'is-info': category.title === selectedCategory },
                  )}
                  href="#/"
                  onClick={() => (
                    setSelectedCategory(category.title)
                  )}
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
                  setSortBy('');

                  return null;
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

                          <a
                            href="#/"
                            onClick={(event) => {
                              if (sortBy !== sortByValue) {
                                setSortCounter(0);
                              }

                              setSortBy(sortByValue);

                              setSortCounter(sortCounter + 1);
                            }}
                          >
                            <span className="icon">
                              <i
                                data-cy="SortIcon"
                                className={cn(
                                  'fas',
                                  { 'fa-sort': sortByValue !== sortBy },
                                  { 'fa-sort-up': (sortCounter !== 0)
                                  && (sortCounter % 2 === 1)
                                  && sortByValue === sortBy },
                                  { 'fa-sort-down': (sortCounter !== 0)
                                  && (sortCounter % 2 === 0)
                                  && sortByValue === sortBy },
                                )}
                              />
                            </span>
                          </a>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(product => (
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
};
