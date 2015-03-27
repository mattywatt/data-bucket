from jsonschema import Draft4Validator

class Validation:

	def __init__(self):
		pass

	def validate(self, **kwargs):
		data = kwargs.get('data')
		xFormat = kwargs.get('x_format')
		# validate postData submitted by user
		schema = {
            "type": "object",
            "description": "schema for whatever",
            "properties": {
                "title": {
                    "type": "string"
                },
                "description": {
                    "type": "string",
                    "maxLength": 200
                },
				"data": {
					"type": "array",
					"items": {
						"type": "object",
						"properties": {
							"x": {
								"type": "string",
								"format": "date-time"
							},
							"y": {
								"type": "number"
							}
						}
					}
				}
			}
		}
		jsonValidator = Draft4Validator(schema)
		errors = jsonValidator.iter_errors(data)

		errorsResp = list()
		for error in errors:
			print '!', error.message
			errorsResp.append( {
		    	"message": error.message.replace('u\'', '\''),
			    "cause": error.cause,
			    "context": error.context,
			    "path": error.path,
			    "absolute_path": error.absolute_path
			} )
		return errorsResp

