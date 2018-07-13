package com.example.madhav.bms_yoga.LoginScreen;


import android.app.ProgressDialog;
import android.os.AsyncTask;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;


import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.madhav.bms_yoga.HomePage.HomeActivity;
import com.example.madhav.bms_yoga.HomePage.profile;
import com.example.madhav.bms_yoga.HomePage.today;
import com.example.madhav.bms_yoga.MainActivity;
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.model.mLogin;
import com.example.madhav.bms_yoga.network.mAPI;
import android.support.v4.app.FragmentManager;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import static com.example.madhav.bms_yoga.network.mAPI.TIP_URL;

public class LoginScreenActivity extends AppCompatActivity {

    private EditText emailText;
    private EditText pwText;
    private TextView createA;
    private TextView forgotP;

    Button lgnButton;
    ProgressDialog progressDialog;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_screen);

        emailText = findViewById(R.id.input_email);
        pwText = findViewById(R.id.input_password);
        lgnButton = findViewById(R.id.btn_login);
        createA = findViewById(R.id.createA);
        forgotP = findViewById(R.id.forgotP);
        emailText.requestFocus();
        lgnButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                login();
            }
        });


        createA.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                /*Toast.makeText(LoginScreenActivity.this, "Create Account",
                        Toast.LENGTH_LONG).show();*/
                FragmentManager fm = getSupportFragmentManager();
                create_account myDialogFragment = new create_account();
                myDialogFragment.show(fm, "create_account_fragment");



            }
        });
        forgotP.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FragmentManager fm = getSupportFragmentManager();
                forgot_password fp = new forgot_password();
                fp.show(fm, "forgot_password_fragment");
            }
        });
    }

    private void login() {
        final mLogin mlog = new mLogin(emailText.getText().toString(),pwText.getText().toString());

        StringRequest postRequest = new StringRequest(Request.Method.POST, mAPI.LOGIN_URL,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);
                        emailText.setText("");
                        pwText.setText("");
                        emailText.requestFocus();
                        getTip();
                        Toast.makeText(LoginScreenActivity.this, "Login Successful",
                                Toast.LENGTH_LONG).show();


                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", String.valueOf(error));
                        Toast.makeText(LoginScreenActivity.this, "Email or Password is Invalid",
                                Toast.LENGTH_LONG).show();
                    }
                }
        )
        {
            @Override
            protected Map<String, String> getParams()
            {
                Map<String, String>  params = new HashMap<String, String>();
                params.put("email", mlog.getmEmail());

                params.put("password", mlog.getmPassword());

                return params;
            }

        };
        VolleySingleton.getInstance(this).addToRequestQueue(postRequest);
    }
   /* private void getTip() {

        StringRequest postRequest = new StringRequest(Request.Method.GET, mAPI.TIP_URL,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);
                        Intent i = new Intent(LoginScreenActivity.this, HomeActivity.class);
                        i.putExtra("puttip",response);
                        startActivity(i);

                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", String.valueOf(error));
                    }
                }
        )


        ;
        VolleySingleton.getInstance(this).addToRequestQueue(postRequest);
    }*/

   private void getTip() {

       JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
               Request.Method.GET,
               mAPI.TIP_URL,
               null,
               new Response.Listener<JSONObject>() {
                   @Override
                   public void onResponse(JSONObject response) {
                       // Do something with response
                       //mTextView.setText(response.toString());

                       // Process the JSON
                       try{
                           // Get the JSON array
                           JSONArray array = response.getJSONArray("tip");
                           // Loop through the array elements
                           for(int i=0;i<array.length();i++){
                               // Get current json object
                               JSONObject student = array.getJSONObject(i);

                               // Get the current student (json object) data
                               String hea_tip = student.getString("health_tip");
                               //String lastName = student.getString("type");
                              // String age = student.getString("age");

                               // Display the formatted json data in text view
                               //mTextView.append(firstName +" " + lastName +"\nage : " + age);
                              // mTextView.append("\n\n");

                               Intent n = new Intent(LoginScreenActivity.this, HomeActivity.class);
                               n.putExtra("puttip",hea_tip);
                               startActivity(n);
                           }
                       }catch (JSONException e){
                           e.printStackTrace();
                       }
                   }
               },
               new Response.ErrorListener(){
                   @Override
                   public void onErrorResponse(VolleyError error){
                       // Do something when error occurred
                       Log.d("Error.Response", String.valueOf(error));
                   }
               }
       );

       // Add JsonObjectRequest to the RequestQueue
      // requestQueue.add(jsonObjectRequest);
       VolleySingleton.getInstance(this).addToRequestQueue(jsonObjectRequest);
   }




}

