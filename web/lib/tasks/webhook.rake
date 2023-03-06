namespace :webhook do
  desc 'Triggers the orders/create webhook'
  task :orders_create do
    system "npm run shopify webhook trigger -- --topic orders/create --api-version 2023-01 --delivery-method http --shared-secret #{ENV.fetch('SHOPIFY_API_KEY') {raise 'Shopify API Key Required'}} --address https://coderanger-9001.ngrok.io/api/webhooks/orders_create"
  end
end