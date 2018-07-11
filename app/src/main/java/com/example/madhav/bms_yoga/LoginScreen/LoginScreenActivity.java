package com.example.madhav.bms_yoga.LoginScreen;


import android.app.ProgressDialog;
import android.os.AsyncTask;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.madhav.bms_yoga.HomePage.HomeActivity;
import com.example.madhav.bms_yoga.MainActivity;
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.model.mLogin;
import com.example.madhav.bms_yoga.network.mAPI;


import java.util.HashMap;
import java.util.Map;

public class LoginScreenActivity extends AppCompatActivity {

    private EditText emailText;
    private EditText pwText;
    private TextView createA;

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
                Toast.makeText(LoginScreenActivity.this, "Create Account",
                        Toast.LENGTH_LONG).show();
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
                        Toast.makeText(LoginScreenActivity.this, "Login Successful",
                                Toast.LENGTH_LONG).show();
                        Intent i = new Intent(LoginScreenActivity.this, HomeActivity.class);
                        startActivity(i);
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


}

