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

import com.example.madhav.bms_yoga.LoginScreen.LoginScreenActivity;
import com.example.madhav.bms_yoga.LoginScreen.SaveSharedPreference;
import com.example.madhav.bms_yoga.LoginScreen.create_account;
import com.example.madhav.bms_yoga.R;

import static android.content.Context.MODE_PRIVATE;

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

                SaveSharedPreference.setLoggedIn(getActivity(), false);
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


        Toast.makeText(getContext(), "You have been successfully logged out!",
                Toast.LENGTH_LONG).show();
        Intent intent = new Intent(getActivity(), LoginScreenActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        getActivity().finish();
    }




}
