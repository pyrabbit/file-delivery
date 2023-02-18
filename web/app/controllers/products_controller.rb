# frozen_string_literal: true

class ProductsController < AuthenticatedController
  def index
    response_body = ProductFetcher.call()
    status_code = 200
  rescue => e
    status_code = e.is_a?(ShopifyAPI::Errors::HttpResponseError) ? e.code : 500
    response_body = {}
    logger.info "Failed to fetch products: #{e.message}"
  ensure
    render json: response_body.as_json, status: status_code
  end

  def count
    render(json: ShopifyAPI::Product.count.body)
  end

  def create
    ProductCreator.call(count: 5)

    success = true
    error = nil
    status_code = 200
  rescue => e
    success = false
    error = e.message
    status_code = e.is_a?(ShopifyAPI::Errors::HttpResponseError) ? e.code : 500

    logger.info("Failed to create products: #{error}")
  ensure
    render(json: { success: success, error: error }, status: status_code)
  end

  private

  def safe_query_params
    params.permit(:limit, :before, :after)
  end
end
