# frozen_string_literal: true
require 'sidekiq/web'

Rails.application.routes.draw do
  mount Sidekiq::Web, at: '/sidekiq'

  root to: 'home#index'

  mount ShopifyApp::Engine, at: '/api'
  get '/api', to: redirect(path: '/') # Needed because our engine root is /api but that breaks FE routing

  # GraphQL Proxy
  post '/api/graphql', to: 'graphql#proxy'

  # Health Checks
  get '/api/health', to: 'health#index'

  # Files
  get '/api/files', to: 'files#index'
  get '/api/files/:id', to: 'files#show'
  post '/api/files', to: 'files#create'
  delete '/api/files/:id', to: 'files#destroy'

  # Product Attachments
  get '/api/product_attachments', to: 'product_attachments#index'
  post '/api/product_attachments', to: 'product_attachments#create'
  delete '/api/product_attachments', to: 'product_attachments#destroy'

  # Products
  get '/api/products', to: 'products#index'
  get '/api/products/count', to: 'products#count'
  get '/api/products/create', to: 'products#create'

  # Orders
  get '/api/shop_orders/:token/files/:id', to: 'shop_orders#show', as: 'shop_orders'


  # Any other routes will just render the react app
  match '*path' => 'home#index', via: [:get, :post]
end
