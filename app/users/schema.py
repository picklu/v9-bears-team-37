import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User


class Query(graphene.ObjectType):
    user = graphene.Field(
        UserType, id=graphene.Int(required=False),
        email=graphene.String(required=False))

    me = graphene.Field(UserType)

    def resolve_user(self, info, id=None, email=None):
        if id:
            return User.objects.get(id=id)
        elif email:
            return User.objects.get(email=email)
        else:
            raise GraphQLError('Either id or email should be provided in the argument')

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Not logged in')

        return user


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = User(
            username=username,
            email=email
        )
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
