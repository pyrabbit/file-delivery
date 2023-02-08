# frozen_string_literal: true

class HealthController < AuthenticatedController
  def index
    render plain: 'Ok!'
  end
end
