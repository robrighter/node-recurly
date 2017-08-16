'use strict';

const assert = require('assert');
const jsToXml = require('../lib/jsToXml');

describe('JS to XML converter', () => {
	
  it('should build an entire object correctly', () => {
		const output = jsToXml(input());
		assert.equal(output, expected());
	});

  const input = () => ({
    "subscription": {
      "$": {
        "href": "https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4"
      },
      "account": {
        "$": {
          "href": "https://api.recurly.com/v2/accounts/123"
        }
      },
      "invoice": {
        "$": {
          "href": "https://api.recurly.com/v2/invoices/2594"
        }
      },
      "plan": {
        "$": {
          "href": "https://api.recurly.com/v2/plans/insights_pro"
        },
        "plan_code": "insights_pro",
        "name": "Insights Pro"
      },
      "uuid": "3f406bb050dd05ad0e8db14b22b449b4",
      "state": "active",
      "unit_amount_in_cents": {
        "_": "19900",
        "$": {
          "type": "integer"
        }
      },
      "currency": "USD",
      "quantity": {
        "_": "1",
        "$": {
          "type": "integer"
        }
      },
      "activated_at": {
        "_": "2017-08-11T14:08:59Z",
        "$": {
          "type": "datetime"
        }
      },
      "canceled_at": {
        "$": {
          "nil": "nil"
        }
      },
      "expires_at": {
        "$": {
          "nil": "nil"
        }
      },
      "total_billing_cycles": {
        "$": {
          "nil": "nil"
        }
      },
      "remaining_billing_cycles": {
        "$": {
          "nil": "nil"
        }
      },
      "current_period_started_at": {
        "_": "2017-08-11T14:08:59Z",
        "$": {
          "type": "datetime"
        }
      },
      "current_period_ends_at": {
        "_": "2017-09-11T14:08:59Z",
        "$": {
          "type": "datetime"
        }
      },
      "trial_started_at": {
        "$": {
          "nil": "nil"
        }
      },
      "trial_ends_at": {
        "$": {
          "nil": "nil"
        }
      },
      "terms_and_conditions": "",
      "customer_notes": "",
      "tax_in_cents": {
        "_": "9429",
        "$": {
          "type": "integer"
        }
      },
      "tax_type": "vat",
      "tax_region": "ES",
      "tax_rate": {
        "_": "0.21",
        "$": {
          "type": "float"
        }
      },
      "po_number": "",
      "net_terms": {
        "_": "0",
        "$": {
          "type": "integer"
        }
      },
      "collection_method": "automatic",
      "subscription_add_ons": {
        "$": {
          "type": "array"
        },
        "subscription_add_on": {
          "add_on_code": "consumer-insights_pro",
          "unit_amount_in_cents": {
            "_": "25000",
            "$": {
              "type": "integer"
            }
          },
          "quantity": {
            "_": "1",
            "$": {
              "type": "integer"
            }
          }
        }
      },
      "a": [
        {
          "$": {
            "name": "cancel",
            "href": "https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4/cancel",
            "method": "put"
          }
        },
        {
          "$": {
            "name": "terminate",
            "href": "https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4/terminate",
            "method": "put"
          }
        },
        {
          "$": {
            "name": "postpone",
            "href": "https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4/postpone",
            "method": "put"
          }
        },
        {
          "$": {
            "name": "notes",
            "href": "https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4/notes",
            "method": "put"
          }
        }
      ]
    }
  });

  const expected = () => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<subscription href="https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4">
  <account href="https://api.recurly.com/v2/accounts/123"/>
  <invoice href="https://api.recurly.com/v2/invoices/2594"/>
  <plan href="https://api.recurly.com/v2/plans/insights_pro">
    <plan_code>insights_pro</plan_code>
    <name>Insights Pro</name>
  </plan>
  <uuid>3f406bb050dd05ad0e8db14b22b449b4</uuid>
  <state>active</state>
  <unit_amount_in_cents type="integer">19900</unit_amount_in_cents>
  <currency>USD</currency>
  <quantity type="integer">1</quantity>
  <activated_at type="datetime">2017-08-11T14:08:59Z</activated_at>
  <canceled_at nil="nil"/>
  <expires_at nil="nil"/>
  <total_billing_cycles nil="nil"/>
  <remaining_billing_cycles nil="nil"/>
  <current_period_started_at type="datetime">2017-08-11T14:08:59Z</current_period_started_at>
  <current_period_ends_at type="datetime">2017-09-11T14:08:59Z</current_period_ends_at>
  <trial_started_at nil="nil"/>
  <trial_ends_at nil="nil"/>
  <terms_and_conditions/>
  <customer_notes/>
  <tax_in_cents type="integer">9429</tax_in_cents>
  <tax_type>vat</tax_type>
  <tax_region>ES</tax_region>
  <tax_rate type="float">0.21</tax_rate>
  <po_number/>
  <net_terms type="integer">0</net_terms>
  <collection_method>automatic</collection_method>
  <subscription_add_ons type="array">
    <subscription_add_on>
      <add_on_code>consumer-insights_pro</add_on_code>
      <unit_amount_in_cents type="integer">25000</unit_amount_in_cents>
      <quantity type="integer">1</quantity>
    </subscription_add_on>
  </subscription_add_ons>
  <a name="cancel" href="https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4/cancel" method="put"/>
  <a name="terminate" href="https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4/terminate" method="put"/>
  <a name="postpone" href="https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4/postpone" method="put"/>
  <a name="notes" href="https://api.recurly.com/v2/subscriptions/3f406bb050dd05ad0e8db14b22b449b4/notes" method="put"/>
</subscription>`
});