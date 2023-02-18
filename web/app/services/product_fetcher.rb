# frozen_string_literal: true

class ProductFetcher < ApplicationService
  def initialize(session: ShopifyAPI::Context.active_session)
    super()
    @session = session
  end

  def call(limit: 25, after: nil, before: nil)
    client = ShopifyAPI::Clients::Graphql::Admin.new(session: @session)
    client.query(query: build_products_query(limit:, after:, before:))
  end

  def build_products_query(limit:, after:, before:)
    after_query = after.nil? ? "" : ", after: #{after}"
    before_query = before.nil? ? "" : ", before: #{before}"

    <<~GQL
      {
        products (first: #{limit} #{after_query} #{before_query}) {
          edges {
            node {
              id
              title
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    GQL
  end
end
