package com.example.madhav.bms_yoga.HomePage;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.madhav.bms_yoga.LoginScreen.LoginScreenActivity;
import com.example.madhav.bms_yoga.LoginScreen.SaveSharedPreference;
import com.example.madhav.bms_yoga.LoginScreen.create_account;
import com.example.madhav.bms_yoga.R;
import com.example.madhav.bms_yoga.controller.VolleySingleton;
import com.example.madhav.bms_yoga.network.mAPI;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static android.content.Context.MODE_PRIVATE;
import static com.example.madhav.bms_yoga.network.mAPI.LOGOUT_URL;

public class profile extends Fragment {
    TextView logoutBT;
    //Button logoutBT;

            TextView editBT;

    String mParam1;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setHasOptionsMenu(true);//Make sure you have this line of code.
    }
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_profile,container,false);
        android.support.v7.widget.Toolbar myToolbar = (android.support.v7.widget.Toolbar) v.findViewById(R.id.my_toolbar_profile);
        ((AppCompatActivity)getActivity()).setSupportActionBar(myToolbar);
        logoutBT = v.findViewById(R.id.logoutBT);

        editBT = v.findViewById(R.id.editBT);
        /*SharedPreferences prefs = this.getActivity().getSharedPreferences("email_pref",MODE_PRIVATE);
        String restoredText = prefs.getString("email", null);



        if (restoredText != null) {
            String name = prefs.getString("email", "No name defined");//"No name defined" is the default value.
            //Log.d("EMAIL MACHA",name);
            dispUser.setText(name);

        }*/
        editBT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FragmentManager fm = getActivity().getSupportFragmentManager();
                edit_profile myDialogFragment = new edit_profile();
                myDialogFragment.show(fm, "edit_profile_fragment");
            }
        });
        logoutBT.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Set LoggedIn status to false


                // Logout
                logout();

            }
        });
        return v;
    }
    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.dashboard_menu, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    public void logout()
    {


        SaveSharedPreference.setLoggedIn(getActivity(), false);
        Toast.makeText(getContext(), "You have been successfully logged out!",
                Toast.LENGTH_LONG).show();
        Intent intent = new Intent(getActivity(), LoginScreenActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);



        LogOutToken();
        startActivity(intent);

        //Log.d("Token man ",y);

        getActivity().finish();

    }




    private void LogOutToken() {
        SharedPreferences prefs = this.getActivity().getSharedPreferences("token_pref",MODE_PRIVATE);
        String restoredText = prefs.getString("tokky", null);


        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(
                Request.Method.GET,
                mAPI.LOGOUT_URL+restoredText,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // Do something with response
                        //mTextView.setText(response.toString());
                        Log.d("Success.Response", String.valueOf(response));
                        // Process the JSON


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
        VolleySingleton.getInstance(getContext()).addToRequestQueue(jsonObjectRequest);
    }






}
