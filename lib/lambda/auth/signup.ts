import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Values } from "aws-cdk-lib/aws-cloudwatch";


interface  SignUpBody{
    email: string,
    password: string,
    fullName: string,
}
const cognito = new CognitoIdentityProviderClient({});
export const handler: APIGatewayProxyHandlerV2= async (event)=>{
    try {
        
        if (!event.body){
            return {
                statusCode:400,
                body:JSON.stringify({
                    message:'Missing reqsueat body',


                }),
            };
        }
        const body: SignUpBody=JSON.parse(event.body);

     const {email,password,fullName}=body;
     if (!email || !password || !fullName){
        return {
            statusCode:400,
            body:JSON.stringify({
                message:"email,password and fullName are requierde",
            }),
        };
     }
     const attributes =[
        {
        Name:'email',
        Value:email,
        },
   {
        Name:'name',
        Value:fullName,
   },
     ];
     const command= new SignUpCommand({
        ClientId: process.env.USER_POOL_CLIENT!,
        Username:email,
        Password:password,
        UserAttributes:attributes,
     });
     const response=await cognito.send(command);
     return{
        statusCode:201,
        body:JSON.stringify({
            message:"User registered succesfullly",
            userSub: response.UserSub,
            userConfirmed :response.UserConfirmed,

        })
     }
    } catch (error: any) {
        return{
            statusCode:500,
            body:JSON.stringify({
                message: error.name || 'InternalServerError',
                details:error.message || "Something went wrong",
            }),

        };
    }
}