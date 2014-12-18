# Gormanize -  main.rb
require 'sinatra'
require 'sinatra/reloader' if development?
require 'yelp'
require 'json'
require 'foursquare2'

YELP_CONSUMER_KEY = 'vADphAmDfAH85hfNX3LCSw'
YELP_CONSUMER_SECRET = 'Gxq7CNXUU0msMfmmY6vGONb2hCU'
YELP_TOKEN = 'mEaNHUKKale64LCgezrcQ8l5t8DM1Roo'
YELP_TOKEN_SECRET = 'or6DweqUt6Hr-yfOxAnkkNTuNqg'

FOURSQUARE_CLIENT_ID = 'AGWCA02XJBFIPINIDZ0ZOHY4DIARGVM34F1RRHXAKI1CBGEY'
FOURSQUARE_CLIENT_SECRET = '2A1UXNBXZ5VXCX0IO20AWF14UWG3OLWLIARP42Y3DFQDAFDY'
FOURSQUARE_PUSH_SECRET = 'Q0MZTXBC4S1GZX0NM3GW1IZBZMLYJB3RU3KOBVAJKLL1MBQL'
FOURSQUARE_API_VERSION = '20140806'

# Yelp API class
class YelpCalls

  def self.get_yelp_consumer_key
    return YELP_CONSUMER_KEY
  end

  def self.get_yelp_consumer_secret
    return YELP_CONSUMER_SECRET
  end

  def self.get_yelp_token
    return YELP_TOKEN
  end

  def self.get_yelp_token_secret
    return YELP_TOKEN_SECRET
  end

  def self.get_fs_client_id
    return FOURSQUARE_CLIENT_ID
  end

  def self.get_fs_client_secret
    return FOURSQUARE_CLIENT_SECRET
  end

  def self.get_fs_push_secret
    return FOURSQUARE_PUSH_SECRET
  end

  def self.get_fs_api_version
    return FOURSQUARE_API_VERSION
  end

  # Yelp client constructor
  @client = Yelp::Client.new({ consumer_key: YELP_CONSUMER_KEY,
                            consumer_secret: YELP_CONSUMER_SECRET,
                            token: YELP_TOKEN,
                            token_secret: YELP_TOKEN_SECRET
                          })
  
  def self.search_restaurants(address, term)
    params = {term: term.to_s,
      limit: 10
    }
    max =  params[:limit]
    response = @client.search(address.to_s, params)
    output = Array.new
    response.businesses.each {
      |x| output.push(x.name, x.rating)
    }
    return output

  end

end

class FoursquareCalls
  # Foursquare client constructor
  @client = Foursquare2::Client.new(
    :client_id => FOURSQUARE_CLIENT_ID, 
    :client_secret => FOURSQUARE_CLIENT_SECRET,
    :api_version => '20140806'
      )

  def self.search_venue_photos(venueID)
    response = @client.venue_photos(venueID);
      
    output = Array.new
    response.items.each {
      |x| output.push('https://irs0.4sqi.net/img/general/100x150' + x.suffix)
    }

    return output[0..9]
  end

end



get '/' do
  erb :home
end

get '/about' do
  erb :about
end
