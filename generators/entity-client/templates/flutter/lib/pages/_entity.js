<%#
 Copyright 2013-2018 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see http://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
<%_
const variables = {};
const dartFields = {};

const defaultVariablesValues = {};
let hasUserRelationship = false;
let dartKeyType;
if (pkType === 'String') {
    dartKeyType = 'string';
} else {
    dartKeyType = 'number';
}
variables['id'] = 'id';

const id = {};
id['type'] = 'int';
id['name'] = 'id';
dartFields['id'] = id;

fields.forEach(field => {
    const varValue = {};
    const fieldType = field.fieldType;
    const fieldName = field.fieldName;
    let dartType;
    let desc;
    if (field.fieldIsEnum) {
        dartType = fieldType;
    } else if ( fieldType === 'UUID') {
        dartType = 'String';
    } else if ( fieldType === 'Instant') {
        dartType = 'DartTime';
        desc = .toIso8601String() + 'Z';
    } else {
        dartType = fieldType ;
    } 
    /* else { //(fieldType === 'byte[]' || fieldType === 'ByteBuffer') && fieldTypeBlobContent === 'any' || (fieldType === 'byte[]' || fieldType === 'ByteBuffer') && fieldTypeBlobContent === 'image' || fieldType === 'LocalDate'
        dartType = 'any';
        if (['byte[]', 'ByteBuffer'].includes(fieldType) && field.fieldTypeBlobContent !== 'text') {
            variables[fieldName + 'ContentType'] = fieldName + 'ContentType?: ' + 'string';
        }
    } */
    varValue['type'] = dartType;
    varValue['name'] = fieldName;
    varValue['desc'] = desc;
    dartFields[fieldName] = varValue;
});

relationships.forEach(relationship => {
    let fieldType;
    let fieldName;
    const relationshipType = relationship.relationshipType;
    if (relationshipType === 'one-to-many' || relationshipType === 'many-to-many') {
        if (relationship.otherEntityAngularName === 'User') {
            fieldType = 'User[]';
            hasUserRelationship = true;
        } else {
            fieldType = 'BaseEntity[]';
        }
        fieldName = relationship.relationshipFieldNamePlural;
    } else {
        if (dto === 'no') {
            if (relationship.otherEntityAngularName === 'User') {
                fieldType = 'User';
                hasUserRelationship = true;
            } else {
                fieldType = 'BaseEntity';
            }
            fieldName = relationship.relationshipFieldName;
        } else {
            fieldType = dartKeyType;
            fieldName = `${relationship.relationshipFieldName}Id`;
        }
    }
    variables[fieldName] = fieldName + '?: ' + fieldType;
});
_%>

import 'package:flutter/foundation.dart';

<%_ const enumsAlreadyDeclared = [];
fields.forEach(field => {
    if (field.fieldIsEnum && enumsAlreadyDeclared.indexOf(field.fieldType) === -1) {
        enumsAlreadyDeclared.push(field.fieldType); _%>
export const enum <%= field.fieldType %> {<%
        const enums = field.fieldValues.split(',');
        for (let i = 0; i < enums.length; i++) { %>
    '<%= enums[i] %>'<%if (i < enums.length - 1) { %>,<% }
        } %>
}
 
<%_ }
}); _%>

class <%= entityAngularName %> {

    <% for (idx in dartFields) { %>
    final <%- dartFields[idx]['type'] %> this.<%- dartFields[idx]['name'] %>;<% } %>

    const <%= entityAngularName %> ( { <% for (idx in dartFields) { %>
        this.<%- dartFields[idx]['name'] %>,<% } %>
    })

    factory <%= entityAngularName %>.fromJson(Map<String, dynamic> json) {
        return <%= entityAngularName %>(
            <% for (idx in dartFields) { %>
            <%- dartFields[idx]['name'] %>: json['<%- dartFields[idx]['name'] %>'],
            <% } %>
        )
    };

    Map<String, dynamic> toJson() => {
        <% for (idx in dartFields) { %>
        '"<%- dartFields[idx]['name'] %>"': '"$<%- dartFields[idx]['name'] %>"',
        <% } %>
    };
}


/* import 'package:flutter/foundation.dart';

class User {
  final int id;
  final String login;
  final String firstName;
  final String lastName;
  final String email;
  final String imageUrl;
  final bool activated;
  final String langKey;
  final List<dynamic> authorities;
  final String createdBy;
  final DateTime createdDate;
  final String lastModifiedBy;
  final DateTime lastModifiedDate;

  const User(
      {this.id,
      @required this.login,
      @required this.firstName,
      @required this.lastName,
      @required this.email,
      @required this.imageUrl,
      @required this.activated,
      @required this.langKey,
      @required this.authorities,
      @required this.createdBy,
      this.createdDate,
      this.lastModifiedBy,
      this.lastModifiedDate})
      : assert(login != null),
        assert(firstName != null),
        assert(lastName != null),
        assert(email != null),
        assert(imageUrl != null),
        assert(activated != null),
        assert(langKey != null),
        assert(authorities != null),
        assert(createdBy != null),
        assert(createdDate != null);

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
        id: json['id'],
        login: json['login'],
        firstName: json['firstName'],
        lastName: json['lastName'],
        email: json['email'],
        imageUrl: json['imageUrl'],
        activated: json['activated'],
        langKey: json['langKey'],
        authorities: json['authorities'],
        createdBy: json['createdBy'],
        createdDate: (json['createdDate'] != null)
            ? DateTime.parse(json['createdDate'])
            : null,
        lastModifiedBy: json['lastModifiedBy'],
        lastModifiedDate: (json['lastModifiedDate'] != null)
            ? DateTime.parse(json['lastModifiedDate'])
            : null);
  }

  Map<String, dynamic> toJson() => {
        '"id"': '"$id"',
        '"login"': '"$login"',
        '"firstName"': '"$firstName"',
        '"lastName"': '"$lastName"',
        '"email"': '"$email"',
        '"imageUrl"': '"$imageUrl"',
        '"activated"': '"$activated"',
        '"langKey"': '"$langKey"',
        '"authorities"': '$authorities',
        '"createdBy"': '"$createdBy"',
        '"createdDate"': '"' + createdDate.toIso8601String() + 'Z"',
        '"lastModifiedBy"': '"$lastModifiedBy"',
        '"lastModifiedDate"': '"' + lastModifiedDate.toIso8601String() + 'Z"'
      };
}
 */
