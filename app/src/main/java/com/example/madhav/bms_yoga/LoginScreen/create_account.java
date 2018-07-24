package com.example.madhav.bms_yoga.LoginScreen;


import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.example.madhav.bms_yoga.HomePage.HomeActivity;
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.model.mLogin;
import com.example.madhav.bms_yoga.model.mSignup;
import com.example.madhav.bms_yoga.network.mAPI;

import java.util.HashMap;
import java.util.Map;

/**
 * A simple {@link Fragment} subclass.
 */
public class create_account extends DialogFragment {


    public create_account() {
        // Required empty public constructor
    }

    private EditText ins;
    private EditText ies;
    private EditText ips;
    private Button signUP;
    private ImageView dis;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view= inflater.inflate(R.layout.fragment_create_account, container, false);

        ins =  view.findViewById(R.id.input_name_su);
        ies =  view.findViewById(R.id.input_email_su);
        ips =  view.findViewById(R.id.input_password_su);
        signUP = view.findViewById(R.id.btn_signup);
        dis = view.findViewById(R.id.imageView_close);
        signUP.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                register();
            }
        });

        dis.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getDialog().dismiss();
            }
        });


        return view;
    }
    private void register() {
        final mSignup msign = new mSignup(ins.getText().toString(),ies.getText().toString(),ips.getText().toString());

        StringRequest postRequest = new StringRequest(Request.Method.POST, mAPI.SIGNUP_URL,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response) {
                        // response
                        Log.d("Response", response);
                        ins.setText("");
                        ies.setText("");
                        ips.setText("");
                        ins.requestFocus();
                        Toast.makeText(getContext(), "Account has been created successfully",
                                Toast.LENGTH_LONG).show();

                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // error
                        Log.d("Error.Response", String.valueOf(error));
                        Toast.makeText(getContext(), "User exists/empty fields",
                                Toast.LENGTH_LONG).show();
                    }
                }
        )
        {
            @Override
            protected Map<String, String> getParams()
            {
                Map<String, String>  params = new HashMap<String, String>();
                params.put("username", msign.getmSUsername());
                params.put("email", msign.getmSEmail());
                params.put("password", msign.getmSPassword());
                return params;
            }
        };
        VolleySingleton.getInstance(getContext()).addToRequestQueue(postRequest);
    }

}
