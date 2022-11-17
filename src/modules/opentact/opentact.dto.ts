import { IsString, IsBoolean, isDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {components} from './opentact-original.dto'

enum gender {
  Male, Female, Other
}



export abstract class opentactCreateSipUserDto {
  @IsString()
  login: string
  @IsString()
  password: string
  @IsOptional()
  @IsString()
  first_name?: string
  @IsOptional()
  @IsString()
  last_name?: string
  @IsOptional()
  @IsString()
  email?: string
  @IsOptional()
  @IsString()
  phone_number?: string
  @IsOptional()
  @IsString()
  avatar?: string
  @IsOptional()
  @IsBoolean()
  same_domain_calls_only?: boolean
  @IsOptional()
  dob?: Date
  @IsOptional()
  gender?: gender
  @IsOptional()
  @IsString()
  remote_ip: string
}

//TODO:sting or number typing
export abstract class opentactISMSNewParams {
  /**
   * can be string or number
   */
  to: string;
  tn: number;
  message: string;
  /**
   * URL override for messaging profile callback url's
   */
  custom_callback_url?: string;
};


export abstract class opentactIMessagingProfile {
  /**
   * Created on datetime
   */
  created_on?: string;
  /**
   * Last modified on datetime
   */
  modified_on?: string;
  uuid: string;
  /**
   * A user-assigned name to help manage the messaging profile.
   */
  name: string;
  callback_url?: string;
  callback_url2?: string;
  number_pool_enable: boolean;
  long_code_weight: number;
  tollfree_weight: number;
  skip_unhealthy_tns: boolean;
  sticky_sender: boolean;
  /**
   * Profile owner account
   */
  // account: components["schemas"]["IAccount"];
  // created_by: components["schemas"]["IUser"];
  // modified_by: components["schemas"]["IUser"];
  // /**
  //  * Associated TN Leases's
  //  */
  // leases: components["schemas"]["ITNLease"][];
};


export enum opentactESearchMode {
  AND = "AND", OR = "OR"
}

export enum opentactESIPControlAppMethod {
  GET = "GET", POST = "POST"
}

export enum opentactESearchOrder { "ASC", "DESC" };

export enum opentactESMSState { "created", "sending", "sent", "failed" };
export enum opentactESMSIState { "created", "success", "failed" };


export abstract class opentactISMSISearchParams {
  /**
   * how many items to take
   */
  take?: number;
  /**
   * how many items to skip
   */
  skip?: number;
  mode?: opentactESearchMode;
  /**
   * Order items by field's
   * Accepted values:
   * * tn
   * * to
   * * from
   * * message
   * * state
   * * created_on
   * * modified_on
   * * delivered
   */
  order?: object;
  created_on_from?: string;
  created_on_to?: string;
  modified_on_from?: string;
  modified_on_to?: string;
  /**
   * Mask supported
   */
  message?: string;
  tn?: number;
  /**
   * Mask supported
   */
  to?: string;
  /**
   * Mask supported
   */
  from?: string;
  delivered?: boolean;
  readed?: boolean;
  state?: opentactESMSIState
};

export abstract class opentactISMSISMSSearchParams {
  /**
   * how many items to take
   */
  take?: number;
  /**
   * how many items to skip
   */
  skip?: number;
  mode?: opentactESearchMode;
  /**
   * Order items by field's
   * Accepted values:
   * * from
   * * to
   * * message
   * * state
   * * delivered
   * * created_on - by default: **DESC**
   * * modified_on
   */
  order?: { [key: string]: opentactESearchOrder };
  created_on_from?: string;
  created_on_to?: string;
  modified_on_from?: string;
  modified_on_to?: string;
  /**
   * Mask is supported
   */
  from?: string;
  /**
   * Mask is supported
   */
  to?: string;
  thread?: string;
  /**
   * Mask is supported
   */
  message?: string;
  delivered?: boolean;
  state?: opentactESMSState | opentactESMSIState;
};

export abstract class opentactITNOrderItem {
  /** Voice feature */
  voice?: boolean;
  /** Fax feature */
  fax?: boolean;
  /** Sms feature */
  sms?: boolean;
  /** Mms feature */
  mms?: boolean;
  /** Emergency feature */
  emergency?: boolean;
  tn: number;
  /** TNProfile name */
  profile?: string;
  /** Autorenew tn leases */
  autorenew?: boolean;
};

export abstract class opentactISIPControlAppCallSearchParams {
  /** how many items to take */
  take?: number;
  /** how many items to skip */
  skip?: number;
  mode?: opentactESearchMode;
  /**
   * Order items by field's
   *
   * Accepted values:
   * * tn
   * * to
   * * from
   * * state
   * * created_on
   * * modified_on
   */
  order?: object;
  created_on_from?: string;
  created_on_to?: string;
  modified_on_from?: string;
  modified_on_to?: string;
  /** Mask supported */
  tn?: string;
  /** Mask supported */
  from?: string;
  /** Mask supported */
  to?: string;
  state?: components["schemas"]["ECallState"];
  sip_control_app?: components["schemas"]["UUID"];
};

export abstract class opentactITNLeaseSearchParams {
  /** how many items to take */
  take?: number;
  /** how many items to skip */
  skip?: number;
  mode?:  opentactESearchMode;
  /**
   * Order items by field's
   *
   * Accepted values:
   * * tn
   * * created_on
   * * modified_on
   */
  order?: object;
  created_on_from?: string;
  created_on_to?: string;
  modified_on_from?: string;
  modified_on_to?: string;
  /** Mask supported */
  tn?: string;
  autorenew?: boolean;
  sip_connection?: components["schemas"]["UUID"];
  sip_control_app?: components["schemas"]["UUID"];
};


export abstract class opentactITNOrderNewParams {
  items: opentactITNOrderItem;
};

export abstract class opentactISIPControlAppNewParams {
  /**
   * A user-assigned name to help manage the application.
   */
  name: string;
  is_active?: boolean;
  /**
   * SIP Product ID
   */
  product: number;
  /**
   * Specifies a subdomain that can be used to receive Inbound calls to a Connection, in the same way a phone number
   * is used, from a SIP endpoint. Example: the subdomain "example.sip.opentact.org" can be called from any SIP endpoint
   * by using the SIP URI "sip:@example.sip.opentact.org" where the user part can be any alphanumeric value.
   * Please note TLS encrypted calls are not allowed for subdomain calls.
   */
  sip_domain?: string;
  // class4_egress_trunk_settings: components["schemas"]["ISIPControlAppTrunkSettingsNewParams"];
  // class4_ingress_trunk_settings: components["schemas"]["ISIPControlAppTrunkSettingsNewParams"];
  /**
   * Webhooks for this application will be sent to this URL. Must include a scheme such as 'https'.
   *
   * `state`, `from` and `to` will be sent as query params
   */
  webhook_url?: string;
  /**
   * Webhook request type
   *
   * in case of POST method selected, full ISIPControlAppCall entity will be sent as body
   */
  webhook_method?: opentactESIPControlAppMethod;
  /**
   * If null, then there is no timeout, then opentact will not activately hagup the cause.
   *
   * timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
   */
  webhook_request_timeout?: number;
  /**
   * Webhooks for this application will be sent to this URL. Must include a scheme such as 'https'.
   *
   * `from` and `to` will be sent as query params
   */
  call_flow_url?: string;
  /**
   * If null, then there is no timeout, then opentact will not activately hagup the cause.
   *
   * timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
   */
  call_flow_request_timeout?: number;
  /**
   * CallFlow request type
   *
   * in case of POST method selected, full ISIPControlAppCall entity will be sent as body
   */
  call_flow_method?: opentactESIPControlAppMethod;
  /**
   * Outbound Voice Profile uuid
   */
  outbound_voice_profile?: string;
};


export abstract class opentactIOutboundVoiceProfileUpdateParams {
  /** A user-assigned name to help manage the outbound voice profile. */
  name?: string;
  is_active?: boolean;
  /** SIP Product ID */
  product?: number;
  /** TNLease uuid */
  tn_lease?: string | null;
  // class4_ingress_trunk_settings?: components["schemas"]["IOutboundVoiceProfileTrunkSettingsUpdateParams"];
};


export abstract class opentactIOutboundVoiceProfileNewParams {
  /**
   * A user-assigned name to help manage the voice profile.
   */
  name: string;
  tech_prefix?: number;
  /**
   * Allows you to set a limit for outbound Concurrent Channels (1 call amounts to 1 channel)
   */
  channel_limit?: number;
  max_rate?: number;
  /**
   * Enable Call Recording for all outbound calls or only those outbound calls with a specific ANI (or from number)
   */
  // record_calls?: components["schemas"]["EVoiceRecordCallType"];
  daily_spent_limit?: number;
  /**
   * Can be either: mp3 or wav
   */
  // filemat?: components["schemas"]["EVoiceRecordCallFileType"];
  /**
   * both channels on same track or each channel on its own track.
   */
  // audio_track_type?: components["schemas"]["EVoiceRecordCallAudioTrackType"];
};
export abstract class opentactISIPDomainUpdateParams {
  /**
   * SIP domain name
   */
  domain?: string;
  /**
   * SIPConnection uuid
   */
  sip_connection?: string;
  /**
   * SIPControlApp uuid
   */
  sip_control_app?: string;
};

export abstract class opentactISIPControlAppUpdateParams {
  /**
   * A user-assigned name to help manage the application.
   */
  name?: string;
  is_active?: boolean;
  /**
   * SIP Product ID
   */
  product?: number;
  /**
   * Specifies a subdomain that can be used to receive Inbound calls to a Connection, in the same way a phone number
   * is used, from a SIP endpoint. Example: the subdomain "example.sip.opentact.org" can be called from any SIP endpoint
   * by using the SIP URI "sip:@example.sip.opentact.org" where the user part can be any alphanumeric value.
   * Please note TLS encrypted calls are not allowed for subdomain calls.
   */
  sip_domain?: string;
  // class4_egress_trunk_settings?: components["schemas"]["ISIPControlAppTrunkSettingsUpdateParams"];
  // class4_ingress_trunk_settings?: components["schemas"]["ISIPControlAppTrunkSettingsUpdateParams"];
  /**
   * Webhooks for this application will be sent to this URL. Must include a scheme such as 'https'.
   *
   * `state`, `from` and `to` will be sent as query params
   */
  webhook_url?: string;
  /**
   * Webhook request type
   *
   * in case of POST method selected, full ISIPControlAppCall entity will be sent as body
   */
  webhook_method?: opentactESIPControlAppMethod
  /**
   * If null, then there is no timeout, then opentact will not activately hagup the cause.
   *
   * timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
   */
  webhook_request_timeout?: number;
  /**
   * Webhooks for this application will be sent to this URL. Must include a scheme such as 'https'.
   *
   * `from` and `to` will be sent as query params
   */
  call_flow_url?: string;
  /**
   * If null, then there is no timeout, then opentact will not activately hagup the cause.
   *
   * timeout in ms, it resets on redirect. 0 to disable (OS limit applies)
   */
  call_flow_request_timeout?: number;
  /**
   * CallFlow request type
   *
   * in case of POST method selected, full ISIPControlAppCall entity will be sent as body
   */
  call_flow_method?: opentactESIPControlAppMethod
  /**
   * Outbound Voice Profile uuid
   */
  outbound_voice_profile?: string;
};


export abstract class opentactITNLeasesAssignParams {
  /**
   * List of TNLease uuid's to be assigned
   */
  add?: string[];
  /**
   * List of TNLease uuid's to be removed
   */
  remove?: string[];
};

export abstract class opentactISIPUserResponse {
  success: boolean;
  payload: opentactISIPUser;
};


export abstract class opentactISIPUser {
  /**
   * Created on datetime
   */
  created_on?: string;
  /**
   * Last modified on datetime
   */
  modified_on?: string;
  uuid: string;
  login: string;
  ha1?: string;
  ha1b?: string;
  remote_ip?: string;
  /**
   * Accept sip calls only from a same domain
   */
  same_domain_calls_only: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  avatar?: string;
  dob?: string;
}


export abstract class opentactITNSearchParams {
  /**
   * Ten digit telephone number; end * and % as wildcards. () implies match everything and % implies match that
   * specific digit position. For Example: *233 will match all tns that have 233 in them such as 2345672334
   * as well as 2331231234. Another example would be 233%55 would match 2342337556 as well as 7892334559.
   */
  pattern?: string;
  /**
   * Rate center abbreviation (e.g. WSHNGTNZN1)
   */
  rateCenter?: string;
  /**
   * Location Full Name filter for telephone numbers.
   */
  city?: string;
  /**
   * Two-letter state or province abbreviation (e.g. IL, CA)
   */
  province?: string;
  /**
   * Zip code filter for telephone numbers.
   */
  postalCode?: string;
  /**
   * If true, it will do searching based on alphabates as well. If its not sent or false,
   * it will do numeric & X based search.
   */
  abcSearch?: boolean;
  /**
   * TN Profile name
   */
  profile?: string;
};



export abstract class opentactITNSearch {
  /**
   * how many items to take
   */
  take?: number;
  /**
   * how many items to skip
   */
  skip?: number;
  // mode?: components["schemas"]["ESearchMode"];
  /**
   * Order items by field's
   */
  // order?: { [key: string]: components["schemas"]["ESearchOrder"] };
  /**
   * total items founded
   */
  total: number;
  data: opentactITN[];
};

export abstract class opentactITN {
  tn: number;
  class4_did_id?: number;
  registered: boolean;
  // tnlease?: components["schemas"]["ITNLease"];
  // profile: components["schemas"]["ITNProfile"];
  deleted_on?: string;
};


export abstract class opentactITNSearchResponse {
  success: boolean;
  payload: opentactITNSearch;
};



// export abstract class opentactITNOrderNewParams {
//   /**
//    * Voice feature
//    */
//   voice?: boolean;
//   /**
//    * Fax feature
//    */
//   fax?: boolean;
//   /**
//    * Sms feature
//    */
//   sms?: boolean;
//   /**
//    * Mms feature
//    */
//   mms?: boolean;
//   /**
//    * Emergency feature
//    */
//   emergency?: boolean;
//   /**
//    * Array of numbers to order
//    * 
//    */
//   @ApiProperty({
//     description: `Array of numbers to order`,
//     example: ['12085687492'],
//   })
//   tns: number[];
//   /**
//    * Autorenew tn leases
//    */
//   autorenew?: boolean;
//   /**
//    * TNProfile name
//    * @example "US"
//    */
//   profile: string;
//   /**
//    * SIP Connection uuid
//    * @example "8a830fd1-5b89-4f8b-ac3f-fb7095e2b621"
//    */
//   sip_connection?: string;
//   /**
//    * SIP Control app uuid
//    */
//   sip_control_app?: string;
// };


export abstract class opentactITNProfile {
  /**
   * Created on datetime
   */
  created_on?: string;
  /**
   * Last modified on datetime
   */
  modified_on?: string;
  uuid: string;
  name?: string;
  description?: string;
  // priority?: components["schemas"]["EPriority"];
  // tn_provider?: components["schemas"]["IProvider"];
  /**
   * Toll free profile
   * Make sure related tn_provider is support for toll free numbers
   */
  toll_free?: boolean;
  /**
   * tn search RegExp validator
   */
  tn_search_validator?: string;
  /**
   * tn search placeholder
   */
  tn_search_placeholder?: string;
  /**
   * tn search placeholder
   */
  tn_search_tooltip?: string;
  /**
   * Class4 params: client_billing_rule_id
   */
  class4_client_billing_rule_id: number;
  /**
   * Class4 params: vendor_res_id
   */
  class4_vendor_res_id: number;
  /**
   * Class4 params: vendor_billing_rule_id
   */
  class4_vendor_billing_rule_id: number;
  /**
   * is number must be registered using Netnumber?
   */
  register_provider?: opentactIProvider;
  /**
   * Non recurring cost
   */
  nrc: number;
  /**
   * Monthly recurring cost
   */
  mrc: number;
  sms_provider?: opentactIProvider;
  /**
   * Non recurring cost
   */
  sms_nrc: number;
  /**
   * Monthly recurring cost
   */
  sms_mrc: number;
  sms_per_send_cost: number;
  sms_per_receive_cost: number;
  /**
   * Non recurring cost
   */
  mms_nrc: number;
  /**
   * Monthly recurring cost
   */
  mms_mrc: number;
  mms_per_send_cost: number;
  mms_per_receive_cost: number;
  voice_provider?: opentactIProvider;
  /**
   * Non recurring cost
   */
  voice_nrc: number;
  /**
   * Monthly recurring cost
   */
  voice_mrc: number;
  voice_incoming_per_min_cost: number;
  voice_outgoing_per_min_cost: number;
  /**
   * Non recurring cost
   */
  fax_nrc: number;
  /**
   * Monthly recurring cost
   */
  fax_mrc: number;
  fax_incoming_per_min_cost: number;
  fax_outgoing_per_min_cost: number;
  /**
   * Non recurring cost
   */
  emergency_nrc: number;
  /**
   * Monthly recurring cost
   */
  emergency_mrc: number;
  emergency_incoming_per_min_cost: number;
  emergency_outgoing_per_min_cost: number;
};



export abstract class opentactIProvider {
  // name: components["schemas"]["EProvider"];
  // user: components["schemas"]["IUser"];
  // account: components["schemas"]["IAccount"];
  /**
   * Support toll free numbers?
   */
  toll_free?: boolean;
  deleted_on?: string;
};



