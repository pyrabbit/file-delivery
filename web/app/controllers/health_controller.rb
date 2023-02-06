# frozen_string_literal: true

class HealthController < AuthenticatedController
  def index
    render :nothing, status: :ok
  end
end
