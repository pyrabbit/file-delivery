# frozen_string_literal: true

class GraphqlController < AuthenticatedController

  def proxy
    response = ShopifyAPI::Utils::GraphqlProxy.proxy_query(
      headers: request.headers.to_h,
      body: request.raw_post,
      cookies: request.cookies.to_h
    )

    render json: response.body, status: response.code
  rescue ShopifyAPI::Errors::InvalidGraphqlRequestError
    render json: { message: 'Invalid GraphQL request.' }.as_json, status: :unprocessable_entit
  rescue ShopifyAPI::Errors::SessionNotFoundError
    render json: { message: 'Session not found.' }.as_json, as: :unauthorized
  end
end