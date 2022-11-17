import { google } from 'googleapis';
import {Injectable} from '@nestjs/common';
import constants from '../../constants';
import axios from 'axios';

@Injectable()
export class GoogleService {

  private createConnection() {
    return new google.auth.OAuth2(
      constants.GOOGLE_CLIENT_ID,
      constants.GOOGLE_CLIENT_SECRET,
      constants.GOOGLE_REDIRECT_AUTH_URL
    );
  }

  private getConnectionUrl(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ]
    });
  }

  private getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
  }

  getTokens = async code => {
    const { data } = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: constants.GOOGLE_CLIENT_ID,
        client_secret: constants.GOOGLE_CLIENT_SECRET,
        redirect_uri: constants.GOOGLE_REDIRECT_AUTH_URL,
        grant_type: 'authorization_code',
        code,
      },
    });
    console.log(data); // { access_token, expires_in, token_type, refresh_token }
    return data;
  };

  getGoogleUserInfo = async access_token => {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log('GOOGLE DATA', data); // { id, email, given_name, family_name }
    return data;
  };

  public urlGoogle = () => {
    const auth = this.createConnection(); // this is from previous step
    const url = this.getConnectionUrl(auth);
    return url;
  }

  public getGoogleAccountFromCode = async code => {
  
    // get the auth "tokens" from the request
    const auth = this.createConnection();

    const { access_token } = await this.getTokens(code);
    const {id, email, verified_email, given_name, family_name } = await this.getGoogleUserInfo(access_token)
      
    
    // return so we can login or sign up the user
    return {
      id,
      email,
      verified_email,
      first_name: given_name,
      last_name: family_name,
      access_token, // you can save these to the user if you ever want to get their details without making them log in again
    };
  }

}
