curl -X POST localhost:3000/userRegistered --data '{
                                                      "event_id": "xxxxxxx",
                                                      "event_type": "form_response",
                                                      "form_response": {
                                                        "form_id": "bhypWc",
                                                        "token": "xxxxxxxx",
                                                        "submitted_at": "2017-07-13T10:00:32Z",
                                                        "calculated": {
                                                          "score": 42
                                                        },
                                                        "definition": {
                                                          "id": "pWmL9d",
                                                          "title": "Stutz",
                                                          "fields": [
                                                            {
                                                              "id": "1",
                                                              "title": "1. Short text",
                                                              "type": "short_text"
                                                            },
                                                            {
                                                              "id": "2",
                                                              "title": "1. Short text",
                                                              "type": "short_text"
                                                            },
                                                            {
                                                              "id": "3",
                                                              "title": "5. Email",
                                                              "type": "email"
                                                            },
                                                            {
                                                              "id": "4",
                                                              "title": "1. Short text",
                                                              "type": "short_text"
                                                            },
                                                            {
                                                              "id": "5",
                                                              "title": "1. Short text",
                                                              "type": "short_text"
                                                            }
                                                          ]
                                                        },
                                                        "answers": [
                                                          {
                                                            "type": "text",
                                                            "text": "Jane",
                                                            "field": {
                                                              "id": "1",
                                                              "type": "short_text"
                                                            }
                                                          },
                                                          {
                                                            "type": "text",
                                                            "text": "Doe",
                                                            "field": {
                                                              "id": "2",
                                                              "type": "long_text"
                                                            }
                                                          },
                                                          {
                                                            "type": "email",
                                                            "email": "janedoe@acme.com",
                                                            "field": {
                                                              "id": "3",
                                                              "type": "email"
                                                            }
                                                          },
                                                          {
                                                            "type": "text",
                                                            "text": "079000000",
                                                            "field": {
                                                              "id": "4",
                                                              "type": "long_text"
                                                            }
                                                          },
                                                          {
                                                            "type": "text",
                                                            "text": "0x0000001",
                                                            "field": {
                                                              "id": "5",
                                                              "type": "long_text"
                                                            }
                                                          }
                                                        ]
                                                      }
                                                    }
' -H "Content-Type: application/json"
