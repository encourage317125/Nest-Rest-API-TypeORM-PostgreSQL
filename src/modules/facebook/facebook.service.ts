import * as queryString from 'query-string';
import {Injectable} from '@nestjs/common';
import constants from '../../constants';
import axios from 'axios';

@Injectable()
export class FacebookService {

public getLoginUrl () {
  const stringifiedParams = queryString.stringify({
    client_id: constants.FACEBOOK_CLIENT_ID,
    redirect_uri: 'https://denovo.me/DeNoVoLab/facebook/callback',
    scope: ['email', 'user_friends'].join(','), // comma seperated string
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
  });
  const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
  return facebookLoginUrl
}

private async getAccessTokenFromCode(code) {
  const { data } = await axios({
    url: 'https://graph.facebook.com/v4.0/oauth/access_token',
    method: 'get',
    params: {
      client_id: constants.FACEBOOK_CLIENT_ID,
      client_secret: constants.FACEBOOK_SECRET,
      redirect_uri: 'https://denovo.me/DeNoVoLab/facebook/callback',
      code,
    },
  });
  console.log(data); // { access_token, token_type, expires_in }
  return data.access_token;
};


public getFacebookUserData = async (code) => {
  const access_token = await this.getAccessTokenFromCode(code)
  const { data } = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token,
    },
  });
  console.log(data); // { id, email, first_name, last_name }
  return data;
};

}
